export default {
  slug: "deviantart-random",
  name: "DeviantArt Random",
  description:
    "Mengambil 1 karya gambar acak dari DeviantArt berdasarkan kata kunci (karya dewasa dilewati). Respons berupa file gambar langsung, bukan JSON. File yang sangat besar akan diarahkan (redirect) ke URL gambar aslinya.",
  category: "Random",
  method: "GET",
  endpoint: "/api/deviantart-random",
  icon: "Palette",
  parameters: [
    {
      name: "query",
      type: "string",
      required: true,
      description: "Kata kunci karya yang dicari",
      example: "naruto",
    },
    {
      name: "debug",
      type: "string",
      required: false,
      description: "Isi 1 untuk melihat laporan diagnosa (JSON), tanpa mengirim gambar",
      example: "1",
    },
  ],
  responseExample: {
    contentType: "image/jpeg",
    description:
      "File gambar (binary), bukan JSON. Saat gagal, respons berupa JSON { status: false, message, error }.",
  },
  responseFields: [
    { name: "Content-Type", type: "header", description: "Tipe gambar, misalnya image/jpeg atau image/png" },
    { name: "X-Deviation-Title", type: "header", description: "Judul karya (URL-encoded)" },
    { name: "X-Deviation-Author", type: "header", description: "Nama artis (URL-encoded)" },
    { name: "X-Deviation-Source", type: "header", description: "Link halaman karya di DeviantArt" },
  ],
  exampleRequest: "https://samapi.example.com/api/deviantart-random?query=naruto",
};