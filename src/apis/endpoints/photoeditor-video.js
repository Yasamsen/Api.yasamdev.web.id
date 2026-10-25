export default {
  slug: "photoeditor-video",
  name: "PhotoEditor Video AI",
  description: "Mengubah gambar menjadi video dengan AI PhotoEditorAI berdasarkan prompt, durasi, dan resolusi. Rasio mengikuti gambar. Kodenya sama dengan photoeditor-ai; token akun (env PE_VIDEO_TOKEN) opsional dan hanya perlu jika server meminta captcha. Video diproses beberapa menit; jika belum selesai, respons berisi check_url untuk mengambil hasilnya.",
  category: "AI",
  method: "GET",
  endpoint: "/api/photoeditor-video",
  icon: "Video",
  parameters: [
    {
      name: "image",
      type: "string",
      required: true,
      description: "URL gambar yang menjadi frame pertama video.",
      example: "https://example.com/image.jpg"
    },
    {
      name: "prompt",
      type: "string",
      required: true,
      description: "Instruksi gerakan/adegan video (maksimal 1000 karakter).",
      example: "Kamera zoom perlahan, rambut tertiup angin"
    },
    {
      name: "duration",
      type: "number",
      required: false,
      description: "Durasi video dalam detik (2–30). Default 5.",
      example: 5
    },
    {
      name: "resolution",
      type: "select",
      required: false,
      description: "Resolusi video. Default 480p (hemat kredit).",
      options: [
        { label: "480p", value: "480p" },
        { label: "720p", value: "720p" },
        { label: "1080p", value: "1080p" }
      ],
      example: "480p"
    }
  ],
  responseExample: {
    status: true,
    source: "PhotoEditorAI",
    data: {
      job_id: "abc123",
      video_url: "https://example.com/result.mp4",
      raw: { code: 100000, result: { status: 2 } }
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "Menunjukkan apakah request berhasil." },
    { name: "processing", type: "boolean", description: "true (HTTP 202) jika video belum selesai dalam batas waktu fungsi. Buka data.check_url untuk mengambil hasilnya." },
    { name: "data.video_url", type: "string", description: "Link video hasil (jika selesai)." },
    { name: "data.job_id", type: "string", description: "ID job di PhotoEditorAI." },
    { name: "data.check_url", type: "string", description: "Link untuk mengecek ulang job yang belum selesai." },
    { name: "data.raw", type: "object", description: "Respons mentah dari PhotoEditorAI." }
  ],
  exampleRequest: "/api/photoeditor-video?image=https://example.com/image.jpg&prompt=Kamera%20zoom%20perlahan&duration=5&resolution=480p"
};
