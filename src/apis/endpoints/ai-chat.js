export default {
  "slug": "ai-chat",
  "name": "AI Chat",
  "description": "Send prompts to an AI model and receive intelligent text responses with context awareness.",
  "category": "AI",
  "method": "POST",
  "endpoint": "/api/ai-chat",
  "icon": "Bot",
  "parameters": [
    {
      "name": "message",
      "type": "string",
      "required": true,
      "description": "The prompt or question to send to the AI.",
      "example": "What is the capital of Indonesia?"
    },
    {
      "name": "model",
      "type": "string",
      "required": false,
      "description": "AI model to use (gpt-4, llama, gemini).",
      "example": "gpt-4"
    }
  ],
  "responseExample": {
    "success": true,
    "data": {
      "model": "gpt-4",
      "response": "The capital of Indonesia is Jakarta.",
      "usage": {
        "prompt_tokens": 12,
        "completion_tokens": 8,
        "total_tokens": 20
      }
    }
  },
  "responseFields": [
    {
      "name": "success",
      "type": "boolean",
      "description": "Whether the request succeeded."
    },
    {
      "name": "data.model",
      "type": "string",
      "description": "AI model used for the response."
    },
    {
      "name": "data.response",
      "type": "string",
      "description": "AI-generated text response."
    },
    {
      "name": "data.usage",
      "type": "object",
      "description": "Token usage statistics."
    }
  ],
  "exampleRequest": "POST https://samapi.example.com/api/ai-chat\nContent-Type: application/json\n\n{\"message\":\"What is the capital of Indonesia?\",\"model\":\"gpt-4\"}"
};
