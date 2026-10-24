export default {
  slug: "upscale-image",
  name: "Upscale Image",
  description: "Meningkatkan resolusi gambar hingga skala 2x menggunakan PicUpscaler.",
  category: "Tools",
  method: "GET",
  endpoint: "/api/upscale-image",
  icon: "ImagePlus",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "URL gambar yang ingin ditingkatkan resolusinya.",
      example:
        "https://i.pinimg.com/736x/75/b6/f8/75b6f821e0604668b3fafeee10497e76.jpg"
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
    "https://samapi.example.com/api/upscale-image?url=https://example.com/image.jpg"
};