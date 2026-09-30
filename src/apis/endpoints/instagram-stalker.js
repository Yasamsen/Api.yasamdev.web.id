export default {
  "slug": "instagram-stalker",
  "name": "Instagram Stalker",
  "description": "Get public Instagram profile information without using the official API.",
  "category": "Stalker",
  "method": "GET",
  "endpoint": "/api/instagram-stalker",
  "icon": "Instagram",

  "parameters": [
    {
      "name": "username",
      "type": "string",
      "required": true,
      "description": "The Instagram username. You can include or omit the @ symbol.",
      "example": "wawan_gallagherr"
    }
  ],

  "responseExample": {
    "status": true,
    "data": {
      "username": "wawan_gallagherr",
      "id": "123456789",
      "full_name": "Wawan Gallagherr",
      "profile_pic": "https://instagram.com/profile.jpg",
      "followers": 10000,
      "following": 500,
      "posts": 100,
      "biography": "Sample Instagram biography.",
      "is_verified": false,
      "profile_url": "https://www.instagram.com/wawan_gallagherr/"
    }
  },

  "responseFields": [
    {
      "name": "status",
      "type": "boolean",
      "description": "Whether the request succeeded."
    },
    {
      "name": "data.username",
      "type": "string",
      "description": "Instagram username."
    },
    {
      "name": "data.id",
      "type": "string",
      "description": "Instagram user ID."
    },
    {
      "name": "data.full_name",
      "type": "string",
      "description": "Profile display name."
    },
    {
      "name": "data.profile_pic",
      "type": "string",
      "description": "Profile picture URL."
    },
    {
      "name": "data.followers",
      "type": "number",
      "description": "Number of followers."
    },
    {
      "name": "data.following",
      "type": "number",
      "description": "Number of accounts followed."
    },
    {
      "name": "data.posts",
      "type": "number",
      "description": "Number of posts."
    },
    {
      "name": "data.biography",
      "type": "string",
      "description": "Instagram profile biography."
    },
    {
      "name": "data.is_verified",
      "type": "boolean",
      "description": "Whether the profile is verified."
    },
    {
      "name": "data.profile_url",
      "type": "string",
      "description": "Instagram profile URL."
    }
  ],

  "exampleRequest": "https://enhancer-roan.vercel.app/api/instagram-stalker?username=wawan_gallagherr"
};