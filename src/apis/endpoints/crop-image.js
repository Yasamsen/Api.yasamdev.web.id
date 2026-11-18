export default {
  slug: "crop-image",
  name: "Crop Image",
  description:
    "Unggah gambar (maksimal 4MB) lalu potong berdasarkan rasio (1:1, 16:9, dst.) atau koordinat piksel manual. Hasilnya berupa link gambar.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/crop-image",
  icon: "Crop",

  parameters: [
    {
      name: "file",
      type: "file",
      required: true,
      description: "Pilih gambar JPG, PNG, WEBP, GIF, atau AVIF. Ukuran maksimal 4 MB.",
      maxSizeLabel: "Maksimal 4 MB",
      example: ""
    },
    {
      name: "ratio",
      type: "select",
      required: false,
      description: "Rasio hasil potongan. Diabaikan jika width dan height diisi.",
      options: [
        { value: "1:1", label: "1:1 — Persegi" },
        { value: "4:3", label: "4:3" },
        { value: "3:4", label: "3:4" },
        { value: "16:9", label: "16:9 — Lebar" },
        { value: "9:16", label: "9:16 — Story / Reels" },
        { value: "3:2", label: "3:2" },
        { value: "2:3", label: "2:3" },
        { value: "21:9", label: "21:9 — Ultrawide" }
      ],
      example: "1:1"
    },
    {
      name: "position",
      type: "select",
      required: false,
      description: "Bagian gambar yang dipertahankan saat memotong berdasarkan rasio.",
      options: [
        { value: "center", label: "Tengah" },
        { value: "top", label: "Atas" },
        { value: "bottom", label: "Bawah" },
        { value: "left", label: "Kiri" },
        { value: "right", label: "Kanan" }
      ],
      example: "center"
    },
    { name: "x", type: "number", required: false, description: "Mode manual: posisi kiri area crop (piksel, default 0).", example: "" },
    { name: "y", type: "number", required: false, description: "Mode manual: posisi atas area crop (piksel, default 0).", example: "" },
    { name: "width", type: "number", required: false, description: "Mode manual: lebar area crop (piksel). Isi bersama height.", example: "" },
    { name: "height", type: "number", required: false, description: "Mode manual: tinggi area crop (piksel). Isi bersama width.", example: "" },
    {
      name: "format",
      type: "select",
      required: false,
      description: "Format gambar hasil.",
      options: [
        { value: "original", label: "Original — format asli" },
        { value: "png", label: "PNG" },
        { value: "jpg", label: "JPG" },
        { value: "webp", label: "WebP" },
        { value: "avif", label: "AVIF" }
      ],
      example: "original"
    }
  ],

  responseExample: {
    status: true,
    source: "Image Cropper (sharp)",
    data: {
      url: "https://files.catbox.moe/abc123.jpg",
      host: "catbox.moe",
      expires: "permanen",
      filename: "foto-cropped.jpg",
      mimetype: "image/jpeg",
      size: 46704,
      mode: "ratio",
      original_width: 800,
      original_height: 500,
      crop: { x: 150, y: 0, width: 500, height: 500 },
      width: 500,
      height: 500,
      processing_ms: 320
    }
  },

  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil, false jika gagal." },
    { name: "source", type: "string", description: "Mesin yang dipakai untuk crop." },
    { name: "data.url", type: "string", description: "Link gambar hasil crop." },
    { name: "data.mode", type: "string", description: "ratio (berdasarkan rasio) atau manual (berdasarkan koordinat)." },
    { name: "data.crop", type: "object", description: "Area yang dipotong pada gambar asli (x, y, width, height)." },
    { name: "data.width / height", type: "number", description: "Ukuran gambar hasil (piksel)." },
    { name: "data.size", type: "number", description: "Ukuran file hasil dalam byte." }
  ],

  exampleRequest:
    'curl -X POST "https://samapi.example.com/api/crop-image" -F "file=@foto.jpg" -F "ratio=16:9" -F "position=center"'
};
