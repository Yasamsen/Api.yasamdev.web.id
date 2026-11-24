export default {
  slug: "compress-image",
  name: "Compress Image",
  description:
    "Unggah gambar (maksimal 4MB) lalu kecilkan ukuran filenya. Pilih format hasil, mode kompresi, dan kualitas. Hasilnya berupa link gambar beserta persentase penghematan.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/compress-image",
  icon: "FileImage",
  parameters: [
    {
      name: "file",
      type: "file",
      required: true,
      description: "Pilih gambar PNG, JPG, WEBP, GIF, atau AVIF (maksimal 4 MB).",
      maxSizeLabel: "Maksimal 4 MB",
      example: ""
    },
    {
      name: "format",
      type: "select",
      required: false,
      description: "Format hasil kompresi.",
      options: [
        { value: "original", label: "Original — format asli" },
        { value: "png", label: "PNG" },
        { value: "jpg", label: "JPG" },
        { value: "webp", label: "WebP" },
        { value: "avif", label: "AVIF" }
      ],
      example: "original"
    },
    {
      name: "mode",
      type: "select",
      required: false,
      description: "Mode kompresi. Lossless memakai kualitas maksimal (JPG tidak bisa benar-benar lossless).",
      options: [
        { value: "balanced", label: "Balanced" },
        { value: "smallest", label: "Smallest file" },
        { value: "lossless", label: "Lossless" }
      ],
      example: "balanced"
    },
    {
      name: "quality",
      type: "number",
      required: false,
      description: "Kualitas output 1–100 (default 80). Angka lebih tinggi biasanya menghasilkan file lebih besar.",
      example: "80"
    }
  ],
  responseExample: {
    status: true,
    source: "Image Compressor (sharp)",
    data: {
      url: "https://files.catbox.moe/abc123.jpg",
      host: "catbox.moe",
      expires: "permanen",
      filename: "foto-compressed.jpg",
      mimetype: "image/jpeg",
      size: 25507,
      originalSize: 128638,
      compressedSize: 25507,
      savingsPercent: 80.2,
      format: "jpeg",
      mode: "balanced",
      quality: 70,
      width: 800,
      height: 500,
      processing_ms: 410
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika proses berhasil" },
    { name: "source", type: "string", description: "Mesin kompresi yang dipakai" },
    { name: "data.url", type: "string", description: "Link gambar hasil kompresi" },
    { name: "data.originalSize", type: "number", description: "Ukuran file awal dalam byte" },
    { name: "data.compressedSize", type: "number", description: "Ukuran file hasil dalam byte" },
    { name: "data.savingsPercent", type: "number", description: "Persentase penghematan ukuran (bisa negatif jika format baru lebih besar)" },
    { name: "data.note", type: "string", description: "Muncul jika gambar sudah optimal dan file asli dikembalikan" }
  ],
  exampleRequest:
    'curl -X POST "https://samapi.example.com/api/compress-image" -F "file=@foto.jpg" -F "format=webp" -F "mode=balanced" -F "quality=80"'
};
