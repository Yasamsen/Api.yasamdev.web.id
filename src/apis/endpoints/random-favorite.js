export default {
  slug: "random-favorite",
  name: "Random Favorite",
  description:
    "Menampilkan gambar favorit secara acak langsung sebagai media (image), bukan JSON. Tambahkan format=json jika hanya ingin URL gambarnya.",
  category: "Random",
  method: "GET",
  endpoint: "/api/random-favorite",
  icon: "Shuffle",
  parameters: [
    {
      name: "format",
      type: "string",
      required: false,
      description:
        "Isi dengan 'json' untuk menerima URL media dalam bentuk JSON. Kosongkan untuk langsung menampilkan gambar.",
      example: "json"
    }
  ],
  responseExample: {
    status: true,
    source: "Yasamsen/media-repo",
    data: {
      url: "https://raw.githubusercontent.com/Yasamsen/media-repo/main/favorite/001.jpg",
      total: 60
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "Status keberhasilan request (hanya pada format=json)" },
    { name: "source", type: "string", description: "Sumber data media" },
    { name: "data.url", type: "string", description: "URL gambar yang dipilih secara acak" },
    { name: "data.total", type: "number", description: "Total media yang tersedia" }
  ],
  exampleRequest: "https://samapi.example.com/api/random-favorite"
};