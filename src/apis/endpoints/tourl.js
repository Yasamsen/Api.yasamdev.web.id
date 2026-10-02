// ====================== METADATA ENDPOINT ======================
// Tempel ke daftar metadata/list endpoint Anda. Sesuaikan nama field jika format Anda berbeda.

const endpointMetadata = [
  {
    name: "Wallpaper Random",
    category: "Wallpaper",
    description: "Ambil wallpaper acak dari Wallpaper Abyss berdasarkan kata kunci. Respons berupa gambar.",
    path: "/api/alphacoders-random",
    method: ["GET"],
    params: [
      { name: "query", alias: "q", type: "string", required: true, example: "naruto", description: "Kata kunci wallpaper" },
      { name: "debug", type: "number", required: false, example: "1", description: "Isi 1 untuk melihat laporan kandidat (JSON)" },
    ],
    response: {
      type: "media",
      contentType: "image/jpeg | image/png | image/gif | image/webp | image/svg+xml",
      headers: ["X-Wallpaper-Id", "X-Wallpaper-Source", "X-Wallpaper-Quality"],
    },
    example: "/api/alphacoders-random?query=naruto",
  },
  {
    name: "Screenshot Web",
    category: "Tools",
    description: "Screenshot halaman website lewat ScreenshotMachine. Protokol https:// opsional. Respons berupa gambar.",
    path: "/api/ssweb",
    method: ["GET"],
    params: [
      { name: "url", type: "string", required: true, example: "yasamdev.web.id", description: "Domain atau URL lengkap (https:// opsional)" },
      { name: "device", type: "string", required: false, default: "desktop", example: "mobile", description: "desktop | tablet | mobile" },
    ],
    response: {
      type: "media",
      contentType: "image/jpeg | image/png",
    },
    example: "/api/ssweb?url=yasamdev.web.id&device=desktop",
  },
  {
    name: "ToURL",
    category: "Uploader",
    description: "Unggah file (maks 4MB) atau salin dari URL lain, lalu dapatkan link publik.",
    path: "/api/tourl",
    method: ["GET", "POST"],
    params: [
      { name: "file", type: "file", required: false, in: "multipart/form-data", description: "File yang diunggah (field apa saja)" },
      { name: "filename", type: "string", required: false, in: "query", example: "foto.png", description: "Nama file untuk mode raw body" },
      { name: "url", type: "string", required: false, in: "query", example: "yasamdev.web.id/gambar.png", description: "URL file remote (https:// opsional)" },
    ],
    response: {
      type: "json",
      example: {
        status: true,
        source: "catbox.moe",
        data: {
          url: "https://files.catbox.moe/abc123.png",
          filename: "foto.png",
          mimetype: "image/png",
          size: 20480,
          expires: "permanen",
        },
      },
    },
    example: "/api/tourl?url=yasamdev.web.id/gambar.png",
  },
];
