export default {
  slug: "tiktok",
  name: "TikTok Downloader",
  description: "Download TikTok video and upload it to CDN.",
  category: "Downloader",
  method: "GET",
  endpoint: "/api/tiktok",
  icon: "Music2",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "TikTok video URL"
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/tiktok?url=https://www.tiktok.com/@user/video/123456"
};