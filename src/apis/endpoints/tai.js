export default {
  slug: "tai",
  name: "Tai Random",
  description: "Mengambil satu data media secara acak dari halaman SFMCompile.",
  category: "Media",
  method: "GET",
  endpoint: "/api/tai",
  icon: "Shuffle",

  parameters: [],

  responseExample: {
    status: true,
    source: "SFMCompile",
    data: {
      title: "Example Title",
      link: "https://sfmcompile.club/example",
      category: "Example",
      share_count: "10",
      views_count: "100",
      type: "video/mp4",
      video_1: "https://example.com/video.mp4",
      video_2: "https://example.com/video.mp4"
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
      description: "Satu data media yang dipilih dari halaman random."
    },
    {
      name: "data.title",
      type: "string",
      description: "Judul media."
    },
    {
      name: "data.link",
      type: "string",
      description: "URL halaman media."
    },
    {
      name: "data.category",
      type: "string",
      description: "Kategori media."
    },
    {
      name: "data.share_count",
      type: "string",
      description: "Jumlah share."
    },
    {
      name: "data.views_count",
      type: "string",
      description: "Jumlah views."
    },
    {
      name: "data.type",
      type: "string",
      description: "Tipe atau MIME type media."
    },
    {
      name: "data.video_1",
      type: "string",
      description: "URL media utama atau gambar."
    },
    {
      name: "data.video_2",
      type: "string",
      description: "URL alternatif media."
    }
  ],

  exampleRequest: "https://samapi.example.com/api/tai"
};