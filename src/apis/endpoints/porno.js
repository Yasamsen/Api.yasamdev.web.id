export default {
  slug: "porno",
  name: "Porno Random",
  description: "Mengambil data media acak beserta informasi metadata dari sumber.",
  category: "Entertainment",
  method: "GET",
  endpoint: "/api/porno",
  icon: "Film",
  parameters: [],
  responseExample: {
    status: true,
    source: "TikPornTok",
    data: {
      title: "Example Title",
      source: "https://example.com/post",
      thumb: "https://example.com/thumb.jpg",
      desc: "Example description",
      upload: "September 30, 2026",
      like: "100",
      dislike: "5",
      favorite: "20",
      views: "1000",
      tags: "example tag",
      video: "https://example.com/video.mp4"
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
      description: "Data media dan metadata yang berhasil diambil."
    },
    {
      name: "data.title",
      type: "string",
      description: "Judul konten."
    },
    {
      name: "data.source",
      type: "string",
      description: "URL atau sumber posting."
    },
    {
      name: "data.thumb",
      type: "string",
      description: "URL thumbnail."
    },
    {
      name: "data.desc",
      type: "string",
      description: "Deskripsi konten."
    },
    {
      name: "data.upload",
      type: "string",
      description: "Informasi waktu upload."
    },
    {
      name: "data.like",
      type: "string",
      description: "Jumlah like."
    },
    {
      name: "data.dislike",
      type: "string",
      description: "Jumlah dislike."
    },
    {
      name: "data.favorite",
      type: "string",
      description: "Jumlah favorite."
    },
    {
      name: "data.views",
      type: "string",
      description: "Jumlah views."
    },
    {
      name: "data.tags",
      type: "string",
      description: "Tag konten."
    },
    {
      name: "data.video",
      type: "string",
      description: "URL video."
    }
  ],
  exampleRequest: "https://samapi.example.com/api/porno"
};