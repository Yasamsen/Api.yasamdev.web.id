export default {
  slug: "qrcode",
  name: "QR Code Generator",
  description: "Generate a QR Code from text or a URL.",
  category: "Generator",
  method: "GET",
  endpoint: "/api/qrcode",
  icon: "QrCode",

  parameters: [
    {
      name: "text",
      type: "string",
      required: true,
      description: "Text or URL to convert into a QR Code.",
      example: "https://example.com"
    }
  ],

  responseExample: {
    success: true,
    type: "image/png",
    description: "The generated QR Code image."
  },

  responseFields: [
    {
      name: "Content-Type",
      type: "string",
      description: "image/png"
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/qrcode?text=https://example.com"
};