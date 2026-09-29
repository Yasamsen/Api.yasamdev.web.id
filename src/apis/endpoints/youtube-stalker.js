export default {
  slug: "youtube-stalker",

  name: "YouTube Stalker",

  description:
    "Mengambil informasi profil channel YouTube tanpa menggunakan YouTube API Key.",

  category: "Social",

  method: "GET",

  endpoint: "/api/youtube-stalker",

  icon: "Youtube",

  parameters: [
    {
      name: "username",
      type: "string",
      required: true,
      description:
        "Username atau handle channel YouTube. Bisa menggunakan atau tanpa tanda @.",
      example: "@kingronal21"
    }
  ],

  responseExample: {
    status: true,
    source: "YouTube",
    data: {
      id: "UCxxxxxxxxxxxxxxxxxxxxxx",
      username: "@kingronal21",
      title: "King Ronal",
      avatar:
        "https://yt3.googleusercontent.com/example.jpg",
      banner:
        "https://yt3.googleusercontent.com/example-banner.jpg",
      subscribers: "100K subscribers",
      videos: "250 videos",
      description:
        "Deskripsi channel YouTube.",
      channel_url:
        "https://www.youtube.com/@kingronal21"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status request."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber data."
    },
    {
      name: "data",
      type: "object",
      description: "Informasi channel YouTube."
    },
    {
      name: "data.id",
      type: "string",
      description: "ID channel YouTube."
    },
    {
      name: "data.username",
      type: "string",
      description: "Username atau handle channel."
    },
    {
      name: "data.title",
      type: "string",
      description: "Nama channel."
    },
    {
      name: "data.avatar",
      type: "string",
      description: "URL foto profil channel."
    },
    {
      name: "data.banner",
      type: "string",
      description: "URL banner channel."
    },
    {
      name: "data.subscribers",
      type: "string",
      description: "Jumlah subscriber yang ditampilkan YouTube."
    },
    {
      name: "data.videos",
      type: "string",
      description: "Jumlah video yang ditampilkan YouTube."
    },
    {
      name: "data.description",
      type: "string",
      description: "Deskripsi channel."
    },
    {
      name: "data.channel_url",
      type: "string",
      description: "URL channel YouTube."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/youtube-stalker?username=@kingronal21"
};