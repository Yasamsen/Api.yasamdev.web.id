export default {
  slug: "favorite-random",
  name: "Favorite Random",
  description:
    "Mengambil gambar secara acak dari media repository Favorite.",

  category: "Media",
  method: "GET",
  endpoint: "/api/favorite-random",
  icon: "Images",

  parameters: [],

  responseExample: {
    status: true,
    creator: "yasamDev",
    source:
      "https://raw.githubusercontent.com/Yasamsen/media-repo/main/favorite/api.json",
    total: 60,
    type: "image",
    url:
      "https://raw.githubusercontent.com/Yasamsen/media-repo/main/favorite/001.jpg"
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