export default {
  "slug": "x-stalker",
  "name": "X (Twitter) Stalker",
  "description": "Get public X (Twitter) profile information without using the official API.",
  "category": "Stalker",
  "method": "GET",
  "endpoint": "/api/x-stalker",
  "icon": "Twitter",
  "parameters": [
    {
      "name": "username",
      "type": "string",
      "required": true,
      "description": "The X (Twitter) username. You can include or omit the @ symbol.",
      "example": "mrbeast"
    }
  ],
  "responseExample": {
    "status": true,
    "data": {
      "username": "mrbeast",
      "name": "MrBeast",
      "description": "Sample profile description.",
      "avatar": "https://pbs.twimg.com/profile_images/sample.jpg",
      "avatar_hd": "https://pbs.twimg.com/profile_images/sample.jpg",
      "banner": "https://pbs.twimg.com/profile_banners/sample.jpg",
      "banner_hd": "https://pbs.twimg.com/profile_banners/sample.jpg",
      "posts": "10000",
      "joined": "Joined Date",
      "followers": 1000000,
      "following": 500,
      "profile_url": "https://x.com/mrbeast"
    }
  },
  "responseFields": [
    { "name": "status", "type": "boolean", "description": "Whether the request succeeded." },
    { "name": "data.username", "type": "string", "description": "X (Twitter) username." },
    { "name": "data.name", "type": "string", "description": "Profile display name." },
    { "name": "data.description", "type": "string", "description": "Profile biography." },
    { "name": "data.avatar", "type": "string", "description": "Profile avatar URL." },
    { "name": "data.banner", "type": "string", "description": "Profile banner URL." },
    { "name": "data.posts", "type": "string", "description": "Number of posts when available." },
    { "name": "data.joined", "type": "string", "description": "Account join information when available." },
    { "name": "data.followers", "type": "number", "description": "Number of followers." },
    { "name": "data.following", "type": "number", "description": "Number of accounts followed." },
    { "name": "data.profile_url", "type": "string", "description": "X (Twitter) profile URL." },
    { "name": "execution_time_ms", "type": "number", "description": "Server processing time in milliseconds." }
  ],
  "exampleRequest": "https://samapi.example.com/api/x-stalker?username=mrbeast"
};
