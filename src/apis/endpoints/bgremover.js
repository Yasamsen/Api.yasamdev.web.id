// Simpan sebagai: src/apis/endpoints/bgremover.js
export default {
  slug: "bgremover",
  name: "Background Remover",
  description:
    "Unggah gambar dari perangkat kamu (maksimal 4MB) dan hapus background-nya menjadi PNG transparan.",
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
      example: "foto.jpg"
    },
    {
      name: "format",
      type: "select",
      required: false,
      description: "Bentuk hasil: JSON berisi data URI base64, atau langsung file PNG.",
      options: [
        { value: "json", label: "JSON (base64)" },
        { value: "image", label: "File PNG langsung" }
      ],
      example: "json"
    }
  ],
  responseExample: {
    status: true,
    source: "BgRemove",
    data: {
      input_filename: "foto.jpg",
      output_filename: "foto-nobg.png",
      mimetype: "image/png",
      size: 184320,
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
      rate_limit: { limit: 100, remaining: 99 }
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil, false jika gagal" },
    { name: "source", type: "string", description: "Layanan yang dipakai (BgRemove)" },
    { name: "data.input_filename", type: "string", description: "Nama file yang diunggah (sudah dibersihkan)" },
    { name: "data.output_filename", type: "string", description: "Nama file PNG hasil" },
    { name: "data.mimetype", type: "string", description: "Tipe file hasil, selalu image/png" },
    { name: "data.size", type: "number", description: "Ukuran hasil dalam byte" },
    { name: "data.image", type: "string", description: "PNG transparan sebagai data URI base64" },
    { name: "data.rate_limit.limit", type: "number", description: "Batas harian dari BgRemove" },
    { name: "data.rate_limit.remaining", type: "number", description: "Sisa kuota harian dari BgRemove" }
  ],
  exampleRequest: "POST https://samapi.example.com/api/bgremover (multipart/form-data)"
};
