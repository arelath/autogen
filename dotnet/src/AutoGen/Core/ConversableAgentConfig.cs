// Copyright (c) Microsoft Corporation. All rights reserved.
// ConversableAgentConfig.cs

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.AI.OpenAI;

namespace AutoGen;

public class ConversableAgentConfig
{
    public IEnumerable<FunctionDefinition>? FunctionDefinitions { get; set; }

    public IDictionary<string, Func<string, Task<string>>>? FunctionMap { get; set; }

    public IEnumerable<ILLMConfig>? ConfigList { get; set; }

    public float? Temperature { get; set; } = 0.7f;

    public int? Timeout { get; set; }
}
