export default {
  slug: "ai-chat",
  name: "AI Chat",
  description:
    "Kirim pesan ke AI dan dapatkan jawaban teks. Kirim sessionId dari respons sebelumnya untuk melanjutkan percakapan.",
  category: "AI",
  method: "POST",
  endpoint: "/api/ai-chat",
  icon: "Bot",
  parameters: [
    {
      name: "message",
      type: "string",
      required: true,
      description: "Pesan atau pertanyaan untuk AI.",
      example: "Apa ibu kota Indonesia?"
    },
    {
      name: "sessionId",
      type: "string",
      required: false,
      description: "ID sesi dari respons sebelumnya. Kosongkan untuk memulai percakapan baru.",
      example: ""
    }
  ],
  responseExample: {
    status: true,
    data: {
      reply: "Ibu kota Indonesia adalah Jakarta.",
      sessionId: "3f2b8c1e-9a47-4d6b-8e15-2c7a1f0d9b34"
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil (beberapa penyedia memakai field success)." },
    { name: "data.reply", type: "string", description: "Jawaban dari AI." },
    { name: "data.sessionId", type: "string", description: "ID sesi. Kirim lagi di request berikutnya agar AI mengingat percakapan." }
  ],
  exampleRequest:
    'curl -X POST "https://samapi.example.com/api/ai-chat" -H "Content-Type: application/json" -d \'{"message":"Apa ibu kota Indonesia?"}\''
};
