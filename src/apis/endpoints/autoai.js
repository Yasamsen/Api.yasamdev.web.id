export default {
  slug: "autoai",
  name: "AutoAI",
  description: "AI chat dengan dukungan analisis gambar menggunakan NeoSoft Gemini dan AskMe Vision.",
  category: "AI",
  method: "GET",
  endpoint: "/api/autoai",
  icon: "Bot",

  parameters: [
    {
      name: "text",
      type: "string",
      required: false,
      description: "Pertanyaan atau pesan untuk AI.",
      example: "Jelaskan apa itu kecerdasan buatan"
    },
    {
      name: "image",
      type: "string",
      required: false,
      description: "URL gambar untuk dianalisis oleh Vision.",
      example: "https://example.com/image.jpg"
    },
    {
      name: "sessionId",
      type: "string",
      required: false,
      description: "Session ID NeoSoft untuk melanjutkan percakapan sebelumnya.",
      example: "abc123"
    }
  ],

  responseExample: {
    status: true,
    source: "NeoSoft Gemini",
    data: {
      reply: "AI adalah teknologi yang memungkinkan komputer...",
      sessionId: "abc123"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status keberhasilan request."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber AI yang digunakan."
    },
    {
      name: "data.reply",
      type: "string",
      description: "Jawaban dari AI."
    },
    {
      name: "data.sessionId",
      type: "string",
      description: "Session ID yang dapat digunakan untuk percakapan berikutnya."
    }
  ],

  exampleRequest:
    "/api/autoai?text=Jelaskan%20apa%20itu%20AI"
};