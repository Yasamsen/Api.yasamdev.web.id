export default {
  slug: "random-favorite",
  name: "Random Favorite",
  description: "Mengambil satu URL gambar favorit secara acak dari repository media.",
  category: "Random",
  method: "GET",
  endpoint: "/api/random-favorite",
  icon: "Shuffle",
  parameters: [],
  responseExample: {
    status: true,
    source: "Random Favorite",
    data: {
      url: "https://raw.githubusercontent.com/Yasamsen/media-repo/main/favorite/001.jpg"
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "Status keberhasilan request" },
    { name: "source", type: "string", description: "Nama sumber data" },
    { name: "data.url", type: "string", description: "URL gambar yang dipilih secara acak" }
  ],
  exampleRequest: "https://samapi.example.com/api/random-favorite"
};