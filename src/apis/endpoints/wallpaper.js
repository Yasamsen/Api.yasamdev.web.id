export default {
  slug: "wallpaper",

  name: "Wallpaper Search",

  description:
    "Mencari wallpaper berdasarkan kata kunci dari BestHDWallpaper dan mengembalikan maksimal 10 hasil secara acak.",

  category: "Search",

  method: "GET",

  endpoint: "/api/wallpaper",

  icon: "Image",

  parameters: [
    {
      name: "title",
      type: "string",
      required: true,
      description:
        "Kata kunci wallpaper yang ingin dicari.",
      example: "naruto"
    },

    {
      name: "page",
      type: "string",
      required: false,
      description:
        "Nomor halaman pencarian. Default adalah 1.",
      example: "1"
    }
  ],

  responseExample: {
    status: true,

    source: "BestHDWallpaper",

    data: {
      query: "naruto",

      page: 1,

      total: 10,

      results: [
        {
          title: "Naruto Wallpaper",

          type: "Anime",

          source:
            "https://www.besthdwallpaper.com/anime/naruto-wallpaper",

          image: [
            "https://example.com/image.jpg",
            "https://example.com/image.webp"
          ]
        }
      ]
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description:
        "Menunjukkan apakah request berhasil."
    },

    {
      name: "source",
      type: "string",
      description:
        "Nama sumber data wallpaper."
    },

    {
      name: "data",
      type: "object",
      description:
        "Data hasil pencarian wallpaper."
    },

    {
      name: "data.query",
      type: "string",
      description:
        "Kata kunci yang digunakan untuk pencarian."
    },

    {
      name: "data.page",
      type: "number",
      description:
        "Nomor halaman pencarian."
    },

    {
      name: "data.total",
      type: "number",
      description:
        "Jumlah wallpaper yang dikembalikan."
    },

    {
      name: "data.results",
      type: "array",
      description:
        "Daftar maksimal 10 wallpaper yang dipilih secara acak."
    },

    {
      name: "data.results[].title",
      type: "string",
      description:
        "Judul wallpaper."
    },

    {
      name: "data.results[].type",
      type: "string",
      description:
        "Kategori atau tipe wallpaper."
    },

    {
      name: "data.results[].source",
      type: "string",
      description:
        "URL halaman wallpaper di BestHDWallpaper."
    },

    {
      name: "data.results[].image",
      type: "array",
      description:
        "URL gambar wallpaper yang tersedia."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/wallpaper?title=naruto&page=1"
};