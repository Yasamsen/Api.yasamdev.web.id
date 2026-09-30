export default {
  slug: "tai",
  name: "Tai Random",
  description: "Mengambil daftar konten secara acak dari halaman SFMCompile.",
  category: "Media",
  method: "GET",
  endpoint: "/api/tai",
  icon: "Shuffle",
  parameters: [],
  responseExample: {
    status: true,
    source: "SFMCompile",
    data: [
      {
        title: "Example Title",
        link: "https://sfmcompile.club/example",
        category: "Example",
        share_count: "10",
        views_count: "100",
        type: "video/mp4",
        video_1: "https://example.com/video.mp4",
        video_2: "https://example.com/video.mp4"
      }
    ]
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
      type: "array",
      description: "Daftar konten yang ditemukan."
    },
    {
      name: "data[].title",
      type: "string",
      description: "Judul konten."
    },
    {
      name: "data[].link",
      type: "string",
      description: "Link halaman konten."
    },
    {
      name: "data[].category",
      type: "string",
      description: "Kategori konten."
    },
    {
      name: "data[].share_count",
      type: "string",
      description: "Jumlah share."
    },
    {
      name: "data[].views_count",
      type: "string",
      description: "Jumlah views."
    },
    {
      name: "data[].type",
      type: "string",
      description: "MIME type media."
    },
    {
      name: "data[].video_1",
      type: "string",
      description: "URL media utama atau URL gambar."
    },
    {
      name: "data[].video_2",
      type: "string",
      description: "URL alternatif media."
    }
  ],
  exampleRequest: "https://samapi.example.com/api/tai"
};