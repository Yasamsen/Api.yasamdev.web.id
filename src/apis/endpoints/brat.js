
export default {
  slug: "brat",
  name: "Brat Generator",
  description:
    "Membuat gambar teks bergaya Brat dengan latar hijau dan tulisan hitam.",
  category: "Image",
  method: "GET",
  endpoint: "/api/brat",
  icon: "Image",
  parameters: [
    {
      name: "text",
      type: "string",
      required: true,
      description: "Teks yang ingin dibuat menjadi gambar Brat.",
      example: "hello world",
    },
  ],
  responseExample: {
    status: true,
    source: "Brat Generator",
    data: {
      image: "BASE64_IMAGE_DATA",
      mimeType: "image/webp",
      text: "hello world",
    },
  },
  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status keberhasilan permintaan.",
    },
    {
      name: "source",
      type: "string",
      description: "Sumber pembuatan gambar.",
    },
    {
      name: "data.image",
      type: "string",
      description: "Gambar hasil dalam format Base64.",
    },
    {
      name: "data.mimeType",
      type: "string",
      description: "Jenis MIME gambar hasil.",
    },
    {
      name: "data.text",
      type: "string",
      description: "Teks yang digunakan untuk membuat gambar.",
    },
  ],
  exampleRequest:
    "https://samapi.example.com/api/brat?text=hello%20world",
};
