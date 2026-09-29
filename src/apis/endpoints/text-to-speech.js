export default {
  "slug": "text-to-speech",
  "name": "Text to Speech",
  "description": "Convert text into natural-sounding speech audio in multiple languages and voices.",
  "category": "Utility",
  "method": "POST",
  "endpoint": "/api/tts",
  "icon": "Volume2",
  "parameters": [
    {
      "name": "text",
      "type": "string",
      "required": true,
      "description": "The text to convert to speech.",
      "example": "Hello, welcome to SamApi."
    },
    {
      "name": "lang",
      "type": "string",
      "required": false,
      "description": "Language code (en, id, ja, etc.).",
      "example": "en"
    }
  ],
  "responseExample": {
    "success": true,
    "data": {
      "url": "https://cdn.samapi.com/tts/XXXX.mp3",
      "text": "Hello, welcome to SamApi.",
      "lang": "en",
      "duration": "2.1s"
    }
  },
  "responseFields": [
    {
      "name": "success",
      "type": "boolean",
      "description": "Whether the request succeeded."
    },
    {
      "name": "data.url",
      "type": "string",
      "description": "URL of the generated audio file."
    },
    {
      "name": "data.lang",
      "type": "string",
      "description": "Language used for synthesis."
    },
    {
      "name": "data.duration",
      "type": "string",
      "description": "Audio duration."
    }
  ],
  "exampleRequest": "POST https://samapi.example.com/api/tts\nContent-Type: application/json\n\n{\"text\":\"Hello, welcome to SamApi.\",\"lang\":\"en\"}"
};
