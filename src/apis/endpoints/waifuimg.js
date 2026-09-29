export default {
  slug: "waifuimg",
  name: "Waifu-Ku",
  description: "Mengambil gambar waifu secara random.",
  category: "Anime",
  method: "GET",
  endpoint: "/api/waifuimg",
  icon: "Image",

  parameters: [],

  responseExample: {
    status: true,
    source: "WaifuImg",
    data: {
      url: "https://example.com/waifu.jpg"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status keberhasilan request."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber data."
    },
    {
      name: "data.url",
      type: "string",
      description: "URL gambar waifu."
    }
  ],

  exampleRequest: "/api/waifuimg"
};