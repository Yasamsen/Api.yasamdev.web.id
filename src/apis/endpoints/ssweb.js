export default {
  slug: "ssweb",
  name: "Screenshot Web",
  description: "Mengambil screenshot dari sebuah website menggunakan ScreenshotMachine.",
  category: "Tools",
  method: "GET",
  endpoint: "/api/ssweb",
  icon: "Monitor",
  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "URL website yang ingin diambil screenshot-nya.",
      example: "https://example.com"
    },
    {
      name: "device",
      type: "string",
      required: false,
      description: "Jenis perangkat untuk simulasi screenshot.",
      example: "desktop"
    }
  ],
  responseExample: {
    status: true,
    source: "ScreenshotMachine",
    data: {
      url: "https://example.com",
      device: "desktop",
      contentType: "image/jpeg",
      result: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
    }
  },
  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status request."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber layanan screenshot."
    },
    {
      name: "data.url",
      type: "string",
      description: "URL website yang di-screenshot."
    },
    {
      name: "data.device",
      type: "string",
      description: "Device yang digunakan."
    },
    {
      name: "data.contentType",
      type: "string",
      description: "MIME type gambar."
    },
    {
      name: "data.result",
      type: "string",
      description: "Hasil screenshot dalam format Base64 Data URL."
    }
  ],
  exampleRequest: "https://samapi.example.com/api/ssweb?url=https://example.com&device=desktop"
};