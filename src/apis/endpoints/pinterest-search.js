export default {
  slug: "pinterest-search",
  name: "Pinterest Search",
  description: "Mencari gambar Pin Pinterest berdasarkan kata kunci dan mengembalikan hasil secara acak.",
  category: "Search",
  method: "GET",
  endpoint: "/api/pinterest-search",

  icon: "https://www.google.com/s2/favicons?domain=pinterest.com&sz=128",

  parameters: [
    {
      name: "q",
      type: "string",
      required: true,
      description: "Kata kunci yang ingin dicari di Pinterest.",
      example: "alya"
    }
  ],

  responseExample: {
    status: true,
    source: "Pinterest",
    data: {
      query: "alya",
      total: 10,
      results: [
        {
          title: "Alya",
          description: "Anime Alya",
          pin_id: "123456789",
          pin_url: "https://www.pinterest.com/pin/123456789/",
          image: "https://i.pinimg.com/..."
        }
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
      description: "Kata kunci yang dicari."
    },
    {
      name: "data.total",
      type: "number",
      description: "Jumlah hasil yang dikembalikan."
    },
    {
      name: "data.results",
      type: "array",
      description: "Daftar Pin Pinterest hasil pencarian."
    },
    {
      name: "data.results[].title",
      type: "string",
      description: "Judul Pin."
    },
    {
      name: "data.results[].description",
      type: "string",
      description: "Deskripsi Pin."
    },
    {
      name: "data.results[].pin_id",
      type: "string",
      description: "ID Pin Pinterest."
    },
    {
      name: "data.results[].pin_url",
      type: "string",
      description: "URL Pin Pinterest."
    },
    {
      name: "data.results[].image",
      type: "string",
      description: "URL gambar Pin."
    }
  ],

  exampleRequest: "/api/pinterest-search?q=alya"
};