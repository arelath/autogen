// Copyright (c) Microsoft Corporation. All rights reserved.
// GeminiConfig.cs
using GenerativeAI.Models;

namespace AutoGen.Gemini;

public class GeminiConfig : ILLMConfig
{
    public GeminiConfig(string apiKey, string modelId = GoogleAIModels.GeminiPro)
    {
        this.ApiKey = apiKey;
        this.ModelId = modelId;
    }

    public string ApiKey { get; }

    public string ModelId { get; }
}
