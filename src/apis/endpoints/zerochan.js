export default {
  slug: "zerochan",
  name: "Zerochan",
  description: "Mencari gambar anime dan karakter dari Zerochan.",
  category: "Anime",
  method: "GET",
  endpoint: "/api/zerochan?query={query}",
  icon: "Image",

  parameters: [
    {
      name: "query",
      type: "string",
      required: true,
      description: "Nama karakter atau anime yang ingin dicari.",
      example: "Fubuki"
    }
  ],

  responseExample: {
    status: true,
    source: "Zerochan",
    data: {
      query: "Fubuki",
      total: 2,
      result: [
        {
          id: "4728683",
          title: "Fubuki",
          url: "https://s1.zerochan.net/Fubuki.600.4728683.jpg",
          thumbnail: "https://s1.zerochan.net/Fubuki.600.4728683.jpg",
          full: "https://static.zerochan.net/Fubuki.full.4728683.jpg"
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
      description: "Query pencarian."
    },
    {
      name: "data.total",
      type: "number",
      description: "Jumlah gambar."
    },
    {
      name: "data.result",
      type: "array",
      description: "Daftar hasil gambar."
    },
    {
      name: "data.result[].id",
      type: "string",
      description: "ID gambar Zerochan."
    },
    {
      name: "data.result[].title",
      type: "string",
      description: "Nama gambar."
    },
    {
      name: "data.result[].url",
      type: "string",
      description: "URL gambar ukuran 600px."
    },
    {
      name: "data.result[].thumbnail",
      type: "string",
      description: "URL thumbnail."
    },
    {
      name: "data.result[].full",
      type: "string",
      description: "URL gambar full."
    }
  ],

  exampleRequest:
    "/api/zerochan?query=Fubuki"
};