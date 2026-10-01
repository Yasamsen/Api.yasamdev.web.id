export default {
  slug: "alphacoders",
  name: "Wallpaper Abyss Search",
  description:
    "Mencari wallpaper HD, 4K, dan 8K dari Wallpaper Abyss (Alpha Coders) berdasarkan kata kunci, lengkap dengan thumbnail dan link gambar resolusi penuh.",
  category: "Search",
  method: "GET",
  endpoint: "/api/alphacoders",
  icon: "Image",
  parameters: [
    {
      name: "query",
      type: "string",
      required: true,
      description: "Kata kunci pencarian wallpaper",
      example: "naruto",
    },
    {
      name: "page",
      type: "number",
      required: false,
      description: "Nomor halaman hasil (default: 1)",
      example: 1,
    },
  ],
  responseExample: {
    status: true,
    source: "WallpaperAbyss",
    data: {
      query: "naruto",
      page: 1,
      total_pages: 120,
      total_results: 3600,
      count: 30,
      results: [
        {
          id: "123456",
          title: "Naruto Uzumaki Wallpaper",
          thumbnail: "https://images.alphacoders.com/123/thumb-350-123456.jpg",
          image: "https://images.alphacoders.com/123/123456.jpg",
          page_url: "https://wall.alphacoders.com/big.php?i=123456",
        },
      ],
    },
  },
  responseFields: [
    { name: "query", type: "string", description: "Kata kunci yang dicari" },
    { name: "page", type: "number", description: "Halaman saat ini" },
    { name: "total_pages", type: "number", description: "Perkiraan total halaman" },
    { name: "total_results", type: "number|null", description: "Total wallpaper yang ditemukan" },
    { name: "count", type: "number", description: "Jumlah hasil di halaman ini" },
    { name: "results[].id", type: "string", description: "ID wallpaper" },
    { name: "results[].title", type: "string|null", description: "Judul/alt wallpaper" },
    { name: "results[].thumbnail", type: "string", description: "URL thumbnail" },
    { name: "results[].image", type: "string", description: "URL gambar resolusi penuh" },
    { name: "results[].page_url", type: "string", description: "Halaman detail di Wallpaper Abyss" },
  ],
  exampleRequest: "https://samapi.example.com/api/alphacoders?query=naruto&page=1",
};