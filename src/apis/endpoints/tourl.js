// Simpan sebagai: src/apis/endpoints/tourl.js
export default {
  slug: "tourl",
  name: "ToURL",
  description:
    "Unggah file langsung dari perangkat kamu (maksimal 4MB) dan dapatkan link publik.",
  category: "Uploader",
  method: "POST",
  endpoint: "/api/tourl",
  icon: "UploadCloud",
  parameters: [
    {
      name: "file",
      type: "file",
      required: true,
      description: "Pilih file dari perangkat kamu. Format file umum didukung, maksimal 4 MB.",
      example: "",
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
  exampleRequest: "POST https://samapi.example.com/api/tourl (multipart/form-data)",
};