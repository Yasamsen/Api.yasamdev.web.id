export default {
  slug: "alphacoders-random",
  name: "Wallpaper Abyss Random",
  description:
    "Mengambil 1 wallpaper acak dari Wallpaper Abyss (Alpha Coders) berdasarkan kata kunci, dalam resolusi asli (HD/4K) tanpa dikecilkan. Respons berupa file gambar langsung, bukan JSON.",
  category: "Random",
  method: "GET",
  endpoint: "/api/alphacoders-random",
  icon: "Shuffle",
  parameters: [
    {
      name: "query",
      type: "string",
      required: true,
      description: "Kata kunci wallpaper yang dicari",
      example: "naruto",
    },
  ],
  responseExample: {
    contentType: "image/jpeg",
    description:
      "File gambar resolusi asli (binary), bukan JSON. Saat gagal, respons berupa JSON { status: false, message, error }.",
  },
  responseFields: [
    { name: "Content-Type", type: "header", description: "Tipe gambar, misalnya image/jpeg atau image/png" },
    { name: "X-Wallpaper-Id", type: "header", description: "ID wallpaper di Wallpaper Abyss" },
    { name: "X-Wallpaper-Source", type: "header", description: "Link halaman detail wallpaper" },
  ],
  exampleRequest: "https://samapi.example.com/api/alphacoders-random?query=naruto",
};