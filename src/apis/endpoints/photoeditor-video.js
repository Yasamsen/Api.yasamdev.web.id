export default {
  slug: "photoeditor-video",
  name: "PhotoEditor Video AI",
  description: "Mengubah gambar menjadi video dengan AI PhotoEditorAI berdasarkan prompt, rasio, durasi, dan resolusi. Video diproses beberapa menit; jika belum selesai, respons berisi check_url untuk mengambil hasilnya.",
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
      name: "ratio",
      type: "select",
      required: false,
      description: "Aspect ratio video. Default 16:9.",
      options: [
        { label: "16:9", value: "16:9" },
        { label: "9:16", value: "9:16" },
        { label: "1:1", value: "1:1" },
        { label: "4:3", value: "4:3" },
        { label: "3:4", value: "3:4" }
      ],
      example: "9:16"
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
      description: "Resolusi video. Default 720p.",
      options: [
        { label: "480p", value: "480p" },
        { label: "720p", value: "720p" },
        { label: "1080p", value: "1080p" }
      ],
      example: "720p"
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
  exampleRequest: "/api/photoeditor-video?image=https://example.com/image.jpg&prompt=Kamera%20zoom%20perlahan&ratio=9:16&duration=5&resolution=720p"
};
