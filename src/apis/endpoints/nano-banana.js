export default {
  slug: "nano-banana",
  name: "NanoBanana Image Edit",
  description:
    "Mengedit gambar menggunakan prompt dengan NanoBanana.",

  category: "AI",
  method: "POST",
  endpoint: "/api/nano-banana",
  icon: "Image",

  parameters: [
    {
      name: "image",
      type: "file",
      required: true,
      description:
        "Gambar yang ingin diedit."
    },
    {
      name: "prompt",
      type: "string",
      required: true,
      description:
        "Instruksi perubahan gambar.",
      example:
        "add stylish glasses"
    },
    {
      name: "output_format",
      type: "string",
      required: false,
      description:
        "Format gambar hasil.",
      example: "jpg"
    }
  ],

  responseExample: {
    status: true,
    source: "NanoBanana",
    data: {
      success: true,
      image_url:
        "https://example.com/generated-image.jpg",
      model: "nano-banana"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description:
        "Status request."
    },
    {
      name: "source",
      type: "string",
      description:
        "Sumber layanan."
    },
    {
      name: "data",
      type: "object",
      description:
        "Data hasil edit gambar."
    }
  ]
};