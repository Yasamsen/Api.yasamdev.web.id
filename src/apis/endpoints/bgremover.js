// Simpan sebagai: src/apis/endpoints/bgremover.js
export default {
  slug: "bgremover",
  name: "Background Remover",
  description:
    "Unggah gambar langsung dari perangkat kamu (maksimal 4MB) dan dapatkan link PNG tanpa background.",
  category: "Image",
  method: "POST",
  endpoint: "/api/bgremover",
  icon: "ImageMinus",
  parameters: [
    {
      name: "file",
      type: "file",
      required: true,
      description: "Pilih gambar dari perangkat kamu (JPG, PNG, atau WebP). Maksimal 4 MB.",
      example: "",
    },
  ],
  responseExample: {
    status: true,
    source: "BgRemove",
    data: {
      url: "https://files.catbox.moe/abc123.png",
      filename: "foto-nobg.png",
      mimetype: "image/png",
      size: 184320,
      expires: "permanen",
      host: "catbox.moe",
      rate_limit: { limit: 100, remaining: 99 },
    },
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil, false jika gagal" },
    { name: "source", type: "string", description: "Layanan penghapus background (BgRemove)" },
    { name: "data.url", type: "string", description: "Link publik gambar PNG tanpa background" },
    { name: "data.filename", type: "string", description: "Nama file hasil" },
    { name: "data.mimetype", type: "string", description: "Tipe MIME hasil, selalu image/png" },
    { name: "data.size", type: "number", description: "Ukuran hasil dalam byte" },
    { name: "data.expires", type: "string", description: "Masa berlaku link (permanen atau sementara)" },
    { name: "data.host", type: "string", description: "Server penyimpanan yang dipakai (catbox.moe, uguu.se, atau tmpfiles.org)" },
    { name: "data.rate_limit.limit", type: "number", description: "Batas harian dari BgRemove" },
    { name: "data.rate_limit.remaining", type: "number", description: "Sisa kuota harian dari BgRemove" },
  ],
  exampleRequest: "POST https://samapi.example.com/api/bgremover (multipart/form-data)",
};
