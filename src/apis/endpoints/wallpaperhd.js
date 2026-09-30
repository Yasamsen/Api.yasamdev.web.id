export default {
  slug: "wallpaper",

  name: "Wallpaper Search",

  description:
    "Mengambil 2 wallpaper secara acak berdasarkan kata kunci dari BestHDWallpaper.",

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
    }
  ],

  responseExample: {
    status: true,

    source: "BestHDWallpaper",

    data: {
      query: "naruto",
      page: 7,
      total: 2,

      results: [
        {
          title: "Naruto Wallpaper",
          type: "Anime",
          source:
            "https://www.besthdwallpaper.com/anime/naruto-wallpaper",
          image: [
            "https://example.com/image-1.jpg",
            "https://example.com/image-1.webp"
          ]
        },
        {
          title: "Naruto Uzumaki Wallpaper",
          type: "Anime",
          source:
            "https://www.besthdwallpaper.com/anime/naruto-uzumaki-wallpaper",
          image: [
            "https://example.com/image-2.jpg",
            "https://example.com/image-2.webp"
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
        "Nama sumber wallpaper."
    },
    {
      name: "data",
      type: "object",
      description:
        "Data hasil pencarian."
    },
    {
      name: "data.query",
      type: "string",
      description:
        "Kata kunci pencarian."
    },
    {
      name: "data.page",
      type: "number",
      description:
        "Nomor halaman yang dipilih secara acak."
    },
    {
      name: "data.total",
      type: "number",
      description:
        "Jumlah wallpaper yang dikembalikan. Maksimal 2."
    },
    {
      name: "data.results",
      type: "array",
      description:
        "Dua wallpaper yang dipilih secara acak."
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
        "Kategori wallpaper."
    },
    {
      name: "data.results[].source",
      type: "string",
      description:
        "URL halaman wallpaper."
    },
    {
      name: "data.results[].image",
      type: "array",
      description:
        "URL gambar wallpaper."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/wallpaper?title=naruto"
};