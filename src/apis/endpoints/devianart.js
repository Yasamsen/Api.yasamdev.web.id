export default {
  slug: "devianart",
  name: "DeviantArt Search",
  description: "Mencari gambar dari DeviantArt berdasarkan kata kunci.",
  category: "Search",
  method: "GET",
  endpoint: "/api/devianart",
  icon: "Palette",
  parameters: [
    {
      name: "query",
      type: "string",
      required: true,
      description: "Kata kunci yang ingin dicari di DeviantArt.",
      example: "anime"
    }
  ],
  responseExample: {
    status: true,
    source: "DeviantArt",
    data: {
      query: "anime",
      total: 3,
      result: [
        "https://images-wixmp-ed30a86b8c4ca8878d...jpg",
        "https://images-wixmp-ed30a86b8c4ca8878d...jpg",
        "https://images-wixmp-ed30a86b8c4ca8878d...jpg"
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
      description: "Sumber data."
    },
    {
      name: "data.query",
      type: "string",
      description: "Kata kunci pencarian."
    },
    {
      name: "data.total",
      type: "number",
      description: "Jumlah gambar yang ditemukan."
    },
    {
      name: "data.result",
      type: "array",
      description: "Daftar URL gambar hasil pencarian."
    }
  ],
  exampleRequest: "https://samapi.example.com/api/devianart?query=anime"
};