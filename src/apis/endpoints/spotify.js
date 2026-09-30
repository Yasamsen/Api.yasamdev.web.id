export default {
  "slug": "spotify",
  "name": "Spotify Downloader",
  "description": "Download tracks and fetch metadata from Spotify links including album art and artist info.",
  "category": "Downloader",
  "method": "GET",
  "endpoint": "/api/spotify",
  "icon": "Music",
  "parameters": [
    {
      "name": "url",
      "type": "string",
      "required": true,
      "description": "The Spotify track, album, or playlist URL.",
      "example": "https://open.spotify.com/track/XXXXXXX"
    }
  ],
  "responseExample": {
    "success": true,
    "data": {
      "platform": "spotify",
      "type": "track",
      "title": "Sample Track",
      "artists": [
        "Artist Name"
      ],
      "album": "Album Name",
      "releaseDate": "2024-01-15",
      "duration": "3:45",
      "cover": "https://cdn.spotify.com/cover.jpg",
      "preview": "https://cdn.spotify.com/preview.mp3",
      "download": "https://cdn.spotify.com/track.mp3"
    }
  },
  "responseFields": [
    {
      "name": "success",
      "type": "boolean",
      "description": "Whether the request succeeded."
    },
    {
      "name": "data.type",
      "type": "string",
      "description": "Content type (track, album, playlist)."
    },
    {
      "name": "data.title",
      "type": "string",
      "description": "Track or album title."
    },
    {
      "name": "data.artists",
      "type": "array",
      "description": "List of artist names."
    },
    {
      "name": "data.cover",
      "type": "string",
      "description": "Album cover image URL."
    },
    {
      "name": "data.download",
      "type": "string",
      "description": "Direct download URL for the track."
    }
  ],
  "exampleRequest": "https://samapi.example.com/api/spotify?url=https://open.spotify.com/track/XXXXXXX"
};
