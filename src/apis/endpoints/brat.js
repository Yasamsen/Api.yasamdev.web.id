
export default {
  slug: "brat",
  name: "Brat Generator",
  description:
    "Membuat gambar teks bergaya Brat melalui layanan Lumi Base.",
  category: "Image",
  method: "GET",
  endpoint: "/api/brat",
  icon: "Image",
  parameters: [
    {
      name: "text",
      type: "string",
      required: true,
      description: "Teks yang akan dibuat menjadi gambar Brat.",
      example: "hello world",
    },
  ],
  responseExample: {
    status: true,
    source: "Lumi Base Brat",
    data: {
      image: "BASE64_IMAGE_DATA",
      mimeType: "image/png",
      text: "hello world",
    },
  },
  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status permintaan.",
    },
    {
      name: "source",
      type: "string",
      description: "Sumber layanan generator.",
    },
    {
      name: "data",
      type: "object",
      description:
        "Respons layanan sumber; dapat berisi JSON asli atau data gambar.",
    },
    {
      name: "data.image",
      type: "string",
      description:
        "Gambar dalam Base64 jika layanan mengembalikan gambar langsung.",
    },
    {
      name: "data.mimeType",
      type: "string",
      description: "MIME type gambar jika tersedia.",
    },
    {
      name: "data.text",
      type: "string",
      description: "Teks yang digunakan.",
    },
  ],
  exampleRequest:
    "https://samapi.example.com/api/brat?text=hello%20world",
};
