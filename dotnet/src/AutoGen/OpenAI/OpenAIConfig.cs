// Copyright (c) Microsoft Corporation. All rights reserved.
// OpenAIConfig.cs

namespace AutoGen.OpenAI;

public class OpenAIConfig : ILLMConfig
{
    public OpenAIConfig(string apiKey, string modelId, string? endpoint = null)
    {
        this.ApiKey = apiKey;
        this.ModelId = modelId;
        this.Endpoint = endpoint;
    }

    public string ApiKey { get; }

    public string ModelId { get; }

    public string? Endpoint { get; }
}
