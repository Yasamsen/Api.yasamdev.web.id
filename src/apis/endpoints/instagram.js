export default {
  slug: "instagram",
  name: "Instagram Downloader",
  description:
    "Download foto, video, Reels, dan carousel Instagram menggunakan InstaLoadr.",
  category: "Downloader",
  method: "GET",
  endpoint: "/api/instagram",
  icon: "Instagram",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description:
        "URL postingan, Reel, video, atau konten Instagram yang bersifat publik.",
      example:
        "https://www.instagram.com/reel/Dc9ikbnT_z-/"
    }
  ],

  responseExample: {
    status: true,
    source: "InstaLoadr",
    data: {
      success: true,
      data: [
        {
          type: "video",
          url: "https://example.com/video.mp4",
          thumbnail: "https://example.com/thumbnail.jpg"
        }
      ]
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status request API."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber downloader yang digunakan."
    },
    {
      name: "data",
      type: "object",
      description: "Response asli dari InstaLoadr."
    }
  ],

  exampleRequest:
    "https://DOMAIN-KAMU/api/instagram?url=https://www.instagram.com/reel/Dc9ikbnT_z-/"
};