export default {
  slug: "upscale-image",
  name: "Upscale Image",
  description:
    "Unggah gambar dari perangkat kamu (maksimal 4MB) dan tingkatkan resolusinya hingga 2x menggunakan PicUpscaler.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/upscale-image",
  icon: "ImagePlus",

  parameters: [
    {
      name: "file",
      type: "file",
      required: true,
      description: "Pilih gambar JPG, PNG, atau WEBP. Ukuran maksimal 4 MB.",
      maxSizeLabel: "Maksimal 4 MB",
      example: ""
    }
  ],

  responseExample: {
    status: true,
    source: "PicUpscaler",
    data: {
      // Response asli dari PicUpscaler
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Menunjukkan apakah proses berhasil."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber layanan yang digunakan untuk upscale."
    },
    {
      name: "data",
      type: "object",
      description: "Data hasil upscale dari PicUpscaler."
    }
  ],

  exampleRequest:
    'curl -X POST "https://samapi.example.com/api/upscale-image" -F "file=@foto.jpg"'
};
