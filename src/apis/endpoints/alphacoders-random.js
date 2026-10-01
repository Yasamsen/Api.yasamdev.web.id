export default {
  slug: "alphacoders-random",
  name: "Wallpaper Abyss Random",
  description:
    "Mengambil 1 wallpaper acak dari Wallpaper Abyss (Alpha Coders) berdasarkan kata kunci. Respons berupa gambar langsung (redirect ke file gambar), bukan JSON.",
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
    description: "Redirect 302 ke file gambar, bukan JSON. Saat gagal, respons berupa JSON { status: false, message, error }.",
  },
  responseFields: [
    { name: "Location", type: "header", description: "URL gambar wallpaper resolusi penuh" },
  ],
  exampleRequest: "https://samapi.example.com/api/alphacoders-random?query=naruto",
};