export default {
  slug: "video-to-prompt",
  name: "Video to Prompt AI",
  description:
    "Mengekstrak prompt AI dari URL video menggunakan StarLabs Video to Prompt API. Mendukung prompt untuk model seperti Veo, Sora, Kling, Runway, dan Seedance.",
  category: "AI",
  method: "GET",
  endpoint: "/api/video-to-prompt",
  icon: "WandSparkles",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "URL video yang ingin diproses menjadi prompt AI.",
      example: "https://example.com/video.mp4"
    },
    {
      name: "personalization",
      type: "string",
      required: false,
      description:
        "Gaya atau instruksi tambahan untuk menyesuaikan prompt yang dihasilkan.",
      example: "Buat prompt cinematic dengan pencahayaan dramatis"
    }
  ],

  responseExample: {
    status: true,
    source: "StarLabs Video to Prompt",
    data: {
      scenes: [
        {
          prompt: "Contoh prompt hasil analisis video"
        }
      ],
      info: {
        left: 10
      },
      personalization: "cinematic"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Menunjukkan apakah permintaan berhasil."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber API yang digunakan."
    },
    {
      name: "data",
      type: "object",
      description: "Data hasil ekstraksi prompt dari video."
    },
    {
      name: "data.scenes",
      type: "array",
      description: "Daftar scene dan prompt yang dihasilkan dari video."
    },
    {
      name: "data.info",
      type: "object|null",
      description: "Informasi tambahan dari layanan StarLabs, termasuk sisa kuota jika tersedia."
    },
    {
      name: "data.personalization",
      type: "string|null",
      description: "Personalisasi yang digunakan saat membuat prompt."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/video-to-prompt?url=https://example.com/video.mp4&personalization=cinematic"
};