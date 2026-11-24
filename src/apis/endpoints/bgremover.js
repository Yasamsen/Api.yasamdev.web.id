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
    source: "BRIA RMBG 2.0",
    data: {
      url: "https://files.catbox.moe/abc123-nobg.png",
      filename: "foto-nobg.png",
      mimetype: "image/png",
      size: 184320,
      expires: "permanen",
      host: "catbox.moe",
    },
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil, false jika gagal" },
    { name: "source", type: "string", description: "Model penghapus background yang dipakai (BRIA RMBG 2.0 atau BiRefNet)" },
    { name: "data.url", type: "string", description: "Link publik gambar PNG tanpa background" },
    { name: "data.filename", type: "string", description: "Nama file hasil" },
    { name: "data.mimetype", type: "string", description: "Tipe MIME hasil, selalu image/png" },
    { name: "data.size", type: "number", description: "Ukuran hasil dalam byte" },
    { name: "data.expires", type: "string", description: "Masa berlaku link (permanen atau sementara)" },
    { name: "data.host", type: "string", description: "Server penyimpanan yang dipakai (catbox.moe, uguu.se, atau tmpfiles.org)" },
  ],
  exampleRequest: "POST https://samapi.example.com/api/bgremover (multipart/form-data)",
};
