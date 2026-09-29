export default {
  slug: "twitter-video",
  name: "Twitter/X Video Downloader",
  description: "Mengambil link video Twitter/X berdasarkan URL postingan.",
  category: "Downloader",
  method: "GET",
  endpoint: "/api/twitter-video",
  icon: "Twitter",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "URL postingan Twitter/X yang berisi video.",
      example: "https://x.com/user/status/123456789"
    }
  ],

  responseExample: {
    status: true,
    source: "TwMate",
    data: {
      url: "https://x.com/user/status/123456789",
      videos: [
        {
          quality: "HD",
          type: "MP4",
          downloadLink: "https://example.com/video.mp4"
        }
      ]
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Menunjukkan apakah request berhasil."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber layanan downloader."
    },
    {
      name: "data.url",
      type: "string",
      description: "URL Twitter/X yang diproses."
    },
    {
      name: "data.videos",
      type: "array",
      description: "Daftar video yang ditemukan."
    },
    {
      name: "data.videos[].quality",
      type: "string",
      description: "Kualitas video."
    },
    {
      name: "data.videos[].type",
      type: "string",
      description: "Jenis atau format video."
    },
    {
      name: "data.videos[].downloadLink",
      type: "string",
      description: "Link untuk mengunduh video."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/twitter-video?url=https://x.com/user/status/123456789"
};