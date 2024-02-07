// Copyright (c) Microsoft Corporation. All rights reserved.
// GeminiAgent.cs

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Azure.AI.OpenAI;
using GenerativeAI.Methods;
using GenerativeAI.Models;
//using GenerativeAI.Tools;
using GenerativeAI.Types;

namespace AutoGen.Gemini;

public class GeminiAgent : IAgent
{
    private readonly string _systemMessage;
    private readonly IEnumerable<FunctionDefinition>? _functions;
    private readonly float _temperature;
    private readonly int _maxTokens = 1024;
    private readonly IDictionary<string, Func<string, Task<string>>>? functionMap;
    private GenerativeModel generativeModel { get; }
    private string modelName;

    public GeminiAgent(
        string name,
        string systemMessage,
        ILLMConfig config,
        float temperature = 0.7f,
        int maxTokens = 1024,
        IEnumerable<FunctionDefinition>? functions = null,
        IDictionary<string, Func<string, Task<string>>>? functionMap = null)
    {

        generativeModel = config switch
        {
            // TODO: Add functions to config
            GeminiConfig geminiConfig => new GenerativeModel(geminiConfig.ApiKey, geminiConfig.ModelId),
            _ => throw new ArgumentException($"Unsupported config type {config.GetType()}"),
        };

        modelName = config switch
        {
            GeminiConfig geminiConfig => geminiConfig.ModelId,
            _ => throw new ArgumentException($"Unsupported config type {config.GetType()}"),
        };

        /*if (functions != null)
        {
            foreach (var function in functions)
            {
                ChatCompletionFunction completionFunction = new ChatCompletionFunction();
                completionFunction.Name = function.Name;
                completionFunction.Description = function.Description;

                var functionJson = function.Parameters.ToString();
            }

            //generativeModel.AddGlobalFunctions();
        }*/

        _systemMessage = systemMessage;
        _functions = functions;
        Name = name;
        _temperature = temperature;
        _maxTokens = maxTokens;
        this.functionMap = functionMap;
    }

    public string? Name { get; }

    public async Task<Message> GenerateReplyAsync(IEnumerable<Message> messages, GenerateReplyOptions? options = null, CancellationToken cancellationToken = default)
    {
        var request = messages.Last();
        messages = messages.Take(messages.Count() - 1);

        // add system message if there's no system message in messages
        if (!messages.Any(m => m.Role == Role.System))
        {
            messages = new[]
            {
                // Hack to get around ordering restrictions and no system message
                new Message(Role.User, "Describe what your purpose is."),
                new Message(Role.System, _systemMessage),
            }.Concat(messages);
        }

        else if (messages.First().Role != Role.User)
        {
            messages = new[]
            {
                // Hack to get around ordering restrictions and no system message
                new Message(Role.User, "Describe what your purpose is."),
            }.Concat(messages);
        }

        var processedMessages = ProcessMessages(messages);
        processedMessages = FixupUserMessages(processedMessages);
        StartChatParams startChatParams = new StartChatParams();


        // Broken - this becomes all user messages when calling StartChat!
        var chat = new ChatSession(generativeModel, startChatParams);
        chat.History.AddRange(processedMessages);

        var response = await chat.SendMessageAsync(request.Content!);

        return new Message(Role.Assistant, response);
    }

    private IEnumerable<Content> FixupUserMessages(IEnumerable<Content> messages)
    {
        List<Content> result = new List<Content>();
        string? lastRole = null;
        foreach (var message in messages)
        {
            if (message.Role == lastRole)
            {
                var newRole = Role.User;
                if (message.Role == newRole.ToString())
                    newRole = Role.Assistant;

                // TODO: check functions as well

                result.Add(new Content(new Part[] { new Part() { Text = string.Empty } }, newRole.ToString()));
            }

            lastRole = message.Role;

            result.Add(message);
        }

        return result;
    }

    private IEnumerable<Content> ProcessMessages(IEnumerable<Message> messages)
    {
        var i = 0;
        foreach (var message in messages)
        {
            if (message.Role == Role.System || message.From is null)
            {
                if (message.Role == Role.System)
                {
                    // add as system message
                    yield return message.ToChatRequestSystemMessage();
                }
                else
                {
                    // add as user message
                    yield return message.ToChatRequestUserMessage();
                }
            }
            else if (message.From != this.Name)
            {
                // add as user message
                yield return message.ToChatRequestUserMessage();
            }
            else
            {
                if (message.FunctionArguments is string functionArguments && message.FunctionName is string functionName)
                {
                    var chatMessage = new ChatRequestAssistantMessage(string.Empty)
                    {
                        FunctionCall = new FunctionCall(functionName, functionArguments),
                    };

                    i++;

                    yield return message.ToChatRequestAssistantMessage();

                    var functionResultMessage = new ChatRequestFunctionMessage(functionName, message.Content);

                    yield return message.ToChatRequestFunctionMessage();
                    i++;
                }
                else
                {
                    yield return message.ToChatRequestAssistantMessage();
                }
            }
        }
    }
}
