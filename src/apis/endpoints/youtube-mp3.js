export default {
  slug: "youtube-mp3",
  name: "YouTube MP3",
  description: "Mengubah video YouTube menjadi audio MP3.",
  category: "Downloader",
  method: "GET",
  endpoint: "/api/youtube-mp3",
  icon: "Youtube",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "URL video YouTube.",
      example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ],

  responseExample: {
    status: true,
    source: "YTMP3",
    data: {
      title: "Judul Video",
      author: "Nama Channel",
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      downloadUrl: "https://example.com/audio.mp3"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status keberhasilan request."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber converter."
    },
    {
      name: "data.title",
      type: "string",
      description: "Judul video YouTube."
    },
    {
      name: "data.author",
      type: "string",
      description: "Nama channel YouTube."
    },
    {
      name: "data.thumbnail",
      type: "string",
      description: "URL thumbnail video."
    },
    {
      name: "data.downloadUrl",
      type: "string",
      description: "URL audio MP3."
    }
  ],

  exampleRequest:
    "/api/youtube-mp3?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
};