export default {
  slug: "upscale-image",
  name: "Upscale Image",
  description:
    "Unggah gambar dari perangkat kamu (maksimal 4MB) lalu perbesar resolusinya 2x atau 4x. Diproses langsung di server dengan resampling Lanczos3 + penajaman, hasilnya berupa link gambar.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/upscale-image",
  icon: "ImagePlus",

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
      name: "scale",
      type: "select",
      required: false,
      description: "Pembesaran resolusi. Sisi terpanjang hasil dibatasi 10.000 px.",
      options: [
        { value: "2", label: "2x" },
        { value: "4", label: "4x" }
      ],
      example: "2"
    }
  ],

  responseExample: {
    status: true,
    source: "Image Upscaler (sharp, lanczos3)",
    data: {
      url: "https://files.catbox.moe/abc123.png",
      host: "catbox.moe",
      expires: "permanen",
      filename: "foto-upscaled.png",
      mimetype: "image/png",
      size: 482113,
      scale: 2,
      original_width: 800,
      original_height: 500,
      width: 1600,
      height: 1000,
      capped: false,
      method: "lanczos3 + sharpen",
      processing_ms: 1840
    }
  },

  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil, false jika gagal." },
    { name: "source", type: "string", description: "Mesin yang dipakai untuk upscale." },
    { name: "data.url", type: "string", description: "Link gambar hasil upscale." },
    { name: "data.host", type: "string", description: "Server penyimpanan hasil (catbox.moe, uguu.se, atau tmpfiles.org)." },
    { name: "data.expires", type: "string", description: "Masa berlaku link (permanen atau sementara)." },
    { name: "data.scale", type: "number", description: "Skala pembesaran yang dipakai." },
    { name: "data.original_width / original_height", type: "number", description: "Ukuran gambar asli (piksel)." },
    { name: "data.width / height", type: "number", description: "Ukuran gambar hasil (piksel)." },
    { name: "data.capped", type: "boolean", description: "true jika ukuran hasil dibatasi karena terlalu besar." },
    { name: "data.size", type: "number", description: "Ukuran file hasil dalam byte." }
  ],

  exampleRequest:
    'curl -X POST "https://samapi.example.com/api/upscale-image" -F "file=@foto.jpg" -F "scale=2"'
};
