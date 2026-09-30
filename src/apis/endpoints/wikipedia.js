export default {
  slug: "wikipedia",
  name: "Wikipedia Search",
  description: "Mencari artikel Wikipedia berdasarkan kata kunci.",
  category: "Search",
  method: "GET",
  endpoint: "/api/wikipedia",
  icon: "BookOpen",

  parameters: [
    {
      name: "query",
      type: "string",
      required: true,
      description: "Kata kunci atau nama artikel yang ingin dicari.",
      example: "Indonesia"
    },
    {
      name: "limit",
      type: "number",
      required: false,
      description: "Jumlah hasil pencarian, maksimal 20.",
      example: "10"
    }
  ],

  responseExample: {
    status: true,
    source: "Wikipedia Indonesia",
    query: "Indonesia",
    total: 2,
    data: [
      {
        title: "Indonesia",
        page_id: 120,
        snippet: "Indonesia adalah sebuah negara...",
        word_count: 12345,
        timestamp: "2026-09-26T00:00:00Z",
        url: "https://id.wikipedia.org/wiki/Indonesia"
      }
    ]
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
      name: "query",
      type: "string",
      description: "Kata kunci yang digunakan."
    },
    {
      name: "total",
      type: "number",
      description: "Jumlah hasil pencarian."
    },
    {
      name: "data",
      type: "array",
      description: "Daftar artikel Wikipedia yang ditemukan."
    }
  ]
};