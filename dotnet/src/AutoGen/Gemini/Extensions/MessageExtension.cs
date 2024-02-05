// Copyright (c) Microsoft Corporation. All rights reserved.
// MessageExtension.cs

using GenerativeAI.Types;

namespace AutoGen.Gemini
{
    public static class MessageExtension
    {
        public static Content ToChatRequestUserMessage(this Message message)
        {
            var content = new Content()
            {
                Role = Roles.User,
                Parts = new Part[] { new Part() { Text = message.Content } },
            };

            return content;
        }

        public static Content ToChatRequestAssistantMessage(this Message message)
        {
            var content = new Content()
            {
                Role = Roles.Model,
                Parts = new Part[] { new Part() { Text = message.Content } },
            };

            return content;
        }

        public static Content ToChatRequestSystemMessage(this Message message)
        {
            var content = new Content()
            {
                Role = Roles.Model, // No System role support
                Parts = new Part[] { new Part() { Text = message.Content } },
            };

            return content;
        }

        public static Content ToChatRequestFunctionMessage(this Message message)
        {
            // TODO: Finish this
            var content = new Content()
            {
                Role = Roles.Function,
                Parts = new Part[] { new Part() { Text = message.Content } },
            };

            return content;
        }
    }
}
