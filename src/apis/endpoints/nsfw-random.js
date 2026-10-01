export default {
  slug: "nsfw-random",
  name: "NSFW Random",
  description: "Mengambil satu URL media secara acak dari koleksi Nsfw.json.",
  category: "NSFW",
  method: "GET",
  endpoint: "/api/nsfw-random",
  icon: "Shuffle",
  parameters: [],
  responseExample: {
    status: true,
    source: "NSFW Random",
    data: {
      url: "https://example.com/random-media.jpg"
    }
  },
  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Menunjukkan apakah request berhasil."
    },
    {
      name: "source",
      type: "string",
      description: "Nama sumber endpoint."
    },
    {
      name: "data",
      type: "object",
      description: "Data media random."
    },
    {
      name: "data.url",
      type: "string",
      description: "URL media yang dipilih secara acak."
    }
  ],
  exampleRequest: "https://api.yasamdev.web.id/api/nsfw-random"
};