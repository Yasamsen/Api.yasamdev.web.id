export default {
  slug: "rudder-chat",
  name: "Rudder Chat",
  description: "Ngobrol dengan AI Rudder (th-rudder) tanpa batas. Kirim pesan, dapatkan jawaban teks, lalu lanjutkan percakapan memakai sessionId.",
  category: "AI",
  method: "GET",
  endpoint: "/api/rudder-chat",
  icon: "MessageCircle",

  parameters: [
    {
      name: "message",
      type: "string",
      required: true,
      description: "Pesan atau pertanyaan untuk AI (maksimal 4000 karakter).",
      example: "Jelaskan apa itu API dalam 2 kalimat"
    },
    {
      name: "sessionId",
      type: "string",
      required: false,
      description: "ID sesi dari respons sebelumnya. Isi untuk melanjutkan percakapan; kosongkan untuk memulai percakapan baru.",
      example: "3f2b8c1e-9a47-4d6b-8e15-2c7a1f0d9b34"
    }
  ],

  responseExample: {
    success: true,
    data: {
      message: "Jelaskan apa itu API dalam 2 kalimat",
      reply: "API adalah jembatan yang memungkinkan dua aplikasi saling bertukar data. Dengan API, developer bisa memakai fitur aplikasi lain tanpa tahu cara kerja di dalamnya.",
      sessionId: "3f2b8c1e-9a47-4d6b-8e15-2c7a1f0d9b34",
      model: "th-rudder:free",
      meta: {}
    }
  },

  responseFields: [
    { name: "success", type: "boolean", description: "Status keberhasilan request." },
    { name: "data.message", type: "string", description: "Pesan yang kamu kirim." },
    { name: "data.reply", type: "string", description: "Jawaban dari AI." },
    { name: "data.sessionId", type: "string", description: "ID sesi. Kirim lagi di request berikutnya agar AI mengingat percakapan." },
    { name: "data.model", type: "string", description: "Model AI yang dipakai." },
    { name: "data.meta", type: "object", description: "Informasi tambahan dari penyedia (bisa kosong)." }
  ],

  exampleRequest: "https://samapi.example.com/api/rudder-chat?message=Halo&sessionId=3f2b8c1e-9a47-4d6b-8e15-2c7a1f0d9b34"
};
