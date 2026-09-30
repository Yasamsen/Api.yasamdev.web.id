export default {
  slug: "alya",
  name: "Alya Random Media",
  description:
    "Mengambil gambar atau video secara acak dari media repository Alya.",

  category: "Anime",
  method: "GET",
  endpoint: "/api/alya",
  icon: "Images",

  parameters: [],

  responseExample: {
    status: true,
    creator: "yasamDev",
    source:
      "https://raw.githubusercontent.com/Yasamsen/media-repo/main/alya/api.json",
    total: 33,
    type: "image",
    url:
      "https://raw.githubusercontent.com/Yasamsen/media-repo/main/alya/033.jpg"
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