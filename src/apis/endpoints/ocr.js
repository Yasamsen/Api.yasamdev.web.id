// Simpan sebagai: src/apis/endpoints/ocr.js
export default {
  slug: "ocr",
  name: "OCR",
  description:
    "Unggah gambar atau PDF langsung dari perangkat kamu (maksimal 1MB) dan dapatkan teks yang terbaca di dalamnya.",
  category: "Image",
  method: "POST",
  endpoint: "/api/ocr",
  icon: "ScanText",
  parameters: [
    {
      name: "file",
      type: "file",
      required: true,
      description: "Pilih gambar (JPG, PNG, GIF, BMP, TIFF) atau PDF maksimal 3 halaman. Ukuran maksimal 1 MB.",
      maxSizeLabel: "Maksimal 1 MB",
      example: "",
    },
  ],
  responseExample: {
    status: true,
    source: "OCR.space",
    data: {
      text: "Contoh teks hasil OCR\nBaris kedua",
      characters: 31,
      words: 6,
      pages: 1,
      filename: "struk.jpg",
      mimetype: "image/jpeg",
      size: 245760,
      processing_ms: 1250,
    },
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil, false jika gagal" },
    { name: "source", type: "string", description: "Layanan OCR yang dipakai (OCR.space)" },
    { name: "data.text", type: "string", description: "Seluruh teks yang terbaca" },
    { name: "data.characters", type: "number", description: "Jumlah karakter teks" },
    { name: "data.words", type: "number", description: "Jumlah kata teks" },
    { name: "data.pages", type: "number", description: "Jumlah halaman yang diproses" },
    { name: "data.filename", type: "string", description: "Nama file setelah dibersihkan" },
    { name: "data.mimetype", type: "string", description: "Tipe MIME file hasil deteksi" },
    { name: "data.size", type: "number", description: "Ukuran file dalam byte" },
    { name: "data.processing_ms", type: "number", description: "Waktu proses di server OCR (milidetik)" },
  ],
  exampleRequest: "POST https://samapi.example.com/api/ocr (multipart/form-data)",
};
