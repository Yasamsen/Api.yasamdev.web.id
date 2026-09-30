export default {
  slug: "zerochan",
  name: "Zerochan Search",
  description: "Mencari gambar anime dari Zerochan berdasarkan kata kunci.",
  category: "Anime",
  method: "GET",
  endpoint: "/api/zerochan",
  icon: "Image",
  parameters: [
    {
      name: "query",
      type: "string",
      required: true,
      description: "Kata kunci yang ingin dicari di Zerochan.",
      example: "rem"
    }
  ],
  responseExample: {
    status: true,
    source: "Zerochan",
    data: {
      query: "rem",
      total: 2,
      result: [
        "https://s1.zerochan.net/Rem.600.123456.jpg",
        "https://s1.zerochan.net/Rem.600.654321.jpg"
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
  exampleRequest: "https://samapi.example.com/api/zerochan?query=rem"
};