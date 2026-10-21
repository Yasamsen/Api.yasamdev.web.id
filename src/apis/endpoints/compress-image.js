export default {
  slug: "compress-image",
  name: "Compress Image",
  description: "Unggah gambar lalu kompres ukuran file melalui CleanPNG Image Compressor.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/compress-image",
  icon: "FileImage",
  parameters: [
    {
      name: "image",
      type: "file",
      required: true,
      description: "Pilih gambar PNG, JPG, WEBP, GIF, atau AVIF (maksimal 4 MB).",
      maxSizeLabel: "Maksimal 4 MB",
      example: ""
    },
    {
      name: "format",
      type: "select",
      required: true,
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
      required: true,
      description: "Mode kompresi.",
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
      required: true,
      description: "Kualitas output 1–100. Angka lebih tinggi biasanya menghasilkan file lebih besar.",
      example: "80"
    }
  ],
  responseExample: {
    status: true,
    source: "CleanPNG Image Compressor",
    data: {
      resultUrl: "https://tools.cleanpng.com/image-compressor/...",
      originalSize: 204800,
      compressedSize: 102400,
      savingsPercent: 50
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika proses berhasil" },
    { name: "source", type: "string", description: "Layanan kompresi gambar" },
    { name: "data.resultUrl", type: "string", description: "URL gambar hasil kompresi" },
    { name: "data.originalSize", type: "number", description: "Ukuran file awal dalam byte jika tersedia" },
    { name: "data.compressedSize", type: "number", description: "Ukuran file hasil dalam byte jika tersedia" },
    { name: "data.savingsPercent", type: "number", description: "Persentase penghematan ukuran jika tersedia" }
  ],
  exampleRequest: "POST https://samapi.example.com/api/compress-image (multipart/form-data: image, format, mode, quality)"
};
