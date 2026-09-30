export default {
  slug: "wallpaper",
  name: "Wallpaper Search",
  description:
    "Mencari wallpaper berdasarkan kata kunci dari BestHDWallpaper.",
  category: "Search",
  method: "GET",
  endpoint: "/api/wallpaper",
  icon: "Image",

  parameters: [
    {
      name: "title",
      type: "string",
      required: true,
      description: "Kata kunci wallpaper yang ingin dicari.",
      example: "naruto"
    },
    {
      name: "page",
      type: "string",
      required: false,
      description: "Nomor halaman hasil pencarian. Default 1.",
      example: "1"
    }
  ],

  responseExample: {
    status: true,
    source: "BestHDWallpaper",
    data: {
      query: "naruto",
      page: 1,
      total: 2,
      results: [
        {
          title: "Naruto Wallpaper",
          type: "Anime",
          source:
            "https://www.besthdwallpaper.com/anime/naruto-wallpaper",
          image: [
            "https://example.com/image.jpg",
            "https://example.com/image-1.jpg",
            "https://example.com/image-2.jpg"
          ]
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
      description: "Sumber data wallpaper."
    },
    {
      name: "data",
      type: "object",
      description: "Data hasil pencarian wallpaper."
    },
    {
      name: "data.query",
      type: "string",
      description: "Kata kunci pencarian."
    },
    {
      name: "data.page",
      type: "number",
      description: "Nomor halaman yang digunakan."
    },
    {
      name: "data.total",
      type: "number",
      description: "Jumlah hasil wallpaper pada halaman tersebut."
    },
    {
      name: "data.results",
      type: "array",
      description: "Daftar wallpaper hasil pencarian."
    },
    {
      name: "data.results[].title",
      type: "string",
      description: "Judul wallpaper."
    },
    {
      name: "data.results[].type",
      type: "string",
      description: "Jenis atau kategori wallpaper."
    },
    {
      name: "data.results[].source",
      type: "string",
      description: "URL halaman wallpaper di BestHDWallpaper."
    },
    {
      name: "data.results[].image",
      type: "array",
      description: "Daftar URL gambar wallpaper yang ditemukan."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/wallpaper?title=naruto&page=1"
};