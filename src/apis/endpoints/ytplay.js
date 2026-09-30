export default {
  "slug": "ytplay",
  "name": "YouTube Play",
  "description": "Search YouTube videos and return audio information with lyrics when available.",
  "category": "YouTube",
  "method": "GET",
  "endpoint": "/api/ytplay",
  "icon": "Youtube",

  "parameters": [
    {
      "name": "query",
      "type": "string",
      "required": true,
      "description": "YouTube video title, keyword, or supported YouTube URL.",
      "example": "alan walker faded"
    }
  ],

  "responseExample": {
    "success": true,
    "result": {
      "video_id": "dQw4w9WgXcQ",
      "title": "Sample YouTube Video",
      "channel": "Sample Channel",
      "thumbnail": "https://i.ytimg.com/vi/example/maxresdefault.jpg",
      "audio_url": "https://example.com/audio.mp3",
      "lyrics": {
        "title": "Sample Song",
        "artist": "Sample Artist",
        "album": "Sample Album",
        "lyrics": "Sample lyrics...",
        "synced": true,
        "duration": 212
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
      "name": "result.video_id",
      "type": "string",
      "description": "YouTube video ID."
    },
    {
      "name": "result.title",
      "type": "string",
      "description": "YouTube video title."
    },
    {
      "name": "result.channel",
      "type": "string",
      "description": "YouTube channel name."
    },
    {
      "name": "result.thumbnail",
      "type": "string",
      "description": "Video thumbnail URL."
    },
    {
      "name": "result.audio_url",
      "type": "string",
      "description": "Audio resource URL returned by the converter."
    },
    {
      "name": "result.lyrics",
      "type": "object",
      "description": "Lyrics information when available."
    }
  ],

  "exampleRequest":
    "https://enhancer-roan.vercel.app/api/ytplay?query=alan%20walker%20faded"
};