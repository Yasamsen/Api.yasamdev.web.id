// Simpan sebagai: src/apis/endpoints/tourl.js
export default {
  slug: "tourl",
  name: "ToURL",
  description:
    "Unggah file (maksimal 4MB) atau salin file dari URL lain, lalu dapatkan link publik. Mendukung multipart/form-data, raw body, dan parameter url (https:// opsional).",
  category: "Uploader",
  method: "POST",
  endpoint: "/api/tourl",
  icon: "UploadCloud",
  parameters: [
    {
      name: "file",
      type: "file",
      required: false,
      description:
        "File yang diunggah lewat multipart/form-data (nama field bebas). Wajib diisi jika parameter url tidak dipakai.",
      example: "foto.png",
    },
    {
      name: "url",
      type: "string",
      required: false,
      description:
        "URL file remote yang akan diunggah ulang. Protokol https:// opsional. Bisa dipanggil lewat GET.",
      example: "yasamdev.web.id/gambar.png",
    },
    {
      name: "filename",
      type: "string",
      required: false,
      description: "Nama file untuk mode raw body (query string), mis. ?filename=foto.png",
      example: "foto.png",
    },
  ],
  responseExample: {
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
  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil, false jika gagal" },
    { name: "source", type: "string", description: "Server penyimpanan yang dipakai (catbox.moe, uguu.se, atau tmpfiles.org)" },
    { name: "data.url", type: "string", description: "Link publik file yang diunggah" },
    { name: "data.filename", type: "string", description: "Nama file setelah dibersihkan" },
    { name: "data.mimetype", type: "string", description: "Tipe MIME file" },
    { name: "data.size", type: "number", description: "Ukuran file dalam byte" },
    { name: "data.expires", type: "string", description: "Masa berlaku link (permanen atau sementara)" },
  ],
  exampleRequest: "https://samapi.example.com/api/tourl?url=yasamdev.web.id/gambar.png",
};