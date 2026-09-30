export default {
  slug: "wallpaperhd",
  name: "Wallpaper HD",
  description: "Mencari wallpaper 4K Ultra HD dari AlphaCoders berdasarkan karakter atau kata kunci.",
  category: "Wallpaper",
  method: "GET",
  endpoint: "/api/wallpaperhd",
  icon: "Wallpaper",
  parameters: [
    {
      name: "chara",
      type: "string",
      required: true,
      description: "Nama karakter atau kata kunci wallpaper yang ingin dicari.",
      example: "naruto"
    }
  ],
  responseExample: {
    status: true,
    source: "AlphaCoders",
    data: {
      query: "naruto",
      filter: "4K Ultra HD",
      total: 3,
      result: [
        "https://images2.alphacoders.com/example1.jpg",
        "https://images2.alphacoders.com/example2.jpg",
        "https://images2.alphacoders.com/example3.jpg"
      ]
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
      description: "Sumber wallpaper."
    },
    {
      name: "data.query",
      type: "string",
      description: "Kata kunci pencarian."
    },
    {
      name: "data.filter",
      type: "string",
      description: "Filter resolusi wallpaper."
    },
    {
      name: "data.total",
      type: "number",
      description: "Jumlah wallpaper yang ditemukan."
    },
    {
      name: "data.result",
      type: "array",
      description: "Daftar URL wallpaper HD."
    }
  ],
  exampleRequest: "https://samapi.example.com/api/wallpaperhd?chara=naruto"
};