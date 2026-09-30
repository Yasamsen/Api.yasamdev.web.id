export default {
  slug: "ringtone",
  name: "Ringtone Search",
  description: "Mencari ringtone berdasarkan judul dan mengembalikan satu hasil ringtone.",
  category: "Search",
  method: "GET",
  endpoint: "/api/ringtone",
  icon: "Music",

  parameters: [
    {
      name: "title",
      type: "string",
      required: true,
      description: "Judul atau kata kunci ringtone yang ingin dicari.",
      example: "naruto"
    }
  ],

  responseExample: {
    status: true,
    source: "MeloBoom",
    data: {
      title: "Naruto Example",
      source: "https://meloboom.com/en/example",
      audio: "https://meloboom.com/audio/example.mp3"
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
      description: "Nama sumber data."
    },
    {
      name: "data",
      type: "object",
      description: "Data ringtone yang ditemukan."
    },
    {
      name: "data.title",
      type: "string",
      description: "Judul ringtone."
    },
    {
      name: "data.source",
      type: "string",
      description: "URL halaman ringtone."
    },
    {
      name: "data.audio",
      type: "string",
      description: "URL file audio ringtone."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/ringtone?title=naruto"
};