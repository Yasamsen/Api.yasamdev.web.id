export default {
  slug: "nsfw-random1",
  name: "Nsfw Random V1",
  description:
    "Mengambil gambar atau video secara acak dari media repository Hentai.",

  category: "Media",
  method: "GET",
  endpoint: "/api/nsfw-random1",
  icon: "Images",

  parameters: [],

  responseExample: {
    status: true,
    creator: "yasamDev",
    source:
      "https:///Xxxxxxx",
    total: 33,
    type: "image",
    url:
      "https:///Xxxxxxx"
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status request."
    },
    {
      name: "creator",
      type: "string",
      description: "Creator media."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber api.json."
    },
    {
      name: "total",
      type: "number",
      description: "Jumlah media."
    },
    {
      name: "type",
      type: "string",
      description: "Tipe media: image atau video."
    },
    {
      name: "url",
      type: "string",
      description: "URL media yang dipilih secara acak."
    }
  ]
};