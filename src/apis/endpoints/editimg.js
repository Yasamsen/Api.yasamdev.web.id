export default {
  slug: "editimg",

  name: "AI Image Editor",

  description:
    "Mengedit gambar menggunakan AI berdasarkan URL gambar dan prompt yang diberikan.",

  category: "AI",

  method: "GET",

  endpoint: "/api/editimg",

  icon: "ImagePlus",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "URL gambar yang ingin diedit.",
      example:
        "https://example.com/gambar.jpg"
    },
    {
      name: "prompt",
      type: "string",
      required: true,
      description:
        "Instruksi perubahan gambar menggunakan AI.",
      example:
        "hapus orang di belakang"
    }
  ],

  responseExample: {
    status: true,
    source: "MagicEraser",
    data: {
      job_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      original_url:
        "https://example.com/gambar.jpg",
      prompt:
        "hapus orang di belakang",
      result_url:
        "https://example.com/result.jpg",
      processed_at:
        "2026-09-28T13:00:00.000Z"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description:
        "Menunjukkan apakah request berhasil."
    },
    {
      name: "source",
      type: "string",
      description:
        "Sumber layanan AI yang digunakan."
    },
    {
      name: "data.job_id",
      type: "string",
      description:
        "ID pekerjaan/proses AI."
    },
    {
      name: "data.original_url",
      type: "string",
      description:
        "URL gambar asli."
    },
    {
      name: "data.prompt",
      type: "string",
      description:
        "Prompt yang digunakan untuk mengedit gambar."
    },
    {
      name: "data.result_url",
      type: "string",
      description:
        "URL gambar hasil proses AI."
    },
    {
      name: "data.processed_at",
      type: "string",
      description:
        "Waktu proses selesai dalam format ISO 8601."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/editimg?url=https://example.com/gambar.jpg&prompt=hapus%20orang%20di%20belakang"
};