export default {
  slug: "upscale-image",
  name: "Upscale Image",
  description: "Unggah gambar lalu tingkatkan resolusinya 2x atau 4x menggunakan CleanPNG Image Upscaler.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/upscale-image",
  icon: "ImagePlus",
  parameters: [
    {
      name: "image",
      type: "file",
      required: true,
      description: "Pilih gambar PNG, JPG, atau WEBP dari perangkat kamu (maksimal 4 MB).",
      maxSizeLabel: "Maksimal 4 MB",
      example: ""
    },
    {
      name: "ratio",
      type: "select",
      required: true,
      description: "Skala pembesaran gambar.",
      options: [
        { value: "2", label: "2x — HD" },
        { value: "4", label: "4x — Ultra HD" }
      ],
      example: "2"
    },
    {
      name: "format",
      type: "select",
      required: true,
      description: "Format gambar hasil.",
      options: ["png", "jpg", "webp"],
      example: "png"
    }
  ],
  responseExample: {
    status: true,
    source: "CleanPNG Image Upscaler",
    data: {
      resultUrl: "https://tools.cleanpng.com/image-upscaler/...",
      ratio: "1024 x 1024"
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika proses berhasil" },
    { name: "source", type: "string", description: "Layanan upscale gambar" },
    { name: "data.resultUrl", type: "string", description: "URL gambar hasil upscale" },
    { name: "data.ratio", type: "string", description: "Dimensi gambar hasil" }
  ],
  exampleRequest: "POST https://samapi.example.com/api/upscale-image (multipart/form-data: image, ratio, format)"
};
