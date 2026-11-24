export default {
  slug: "text-to-speech",
  name: "Text to Speech",
  description:
    "Ubah teks (maksimal 1000 karakter) menjadi suara MP3 dalam berbagai bahasa. Hasilnya berupa link audio; tambahkan output=audio untuk mengunduh file langsung.",
  category: "Utility",
  method: "POST",
  endpoint: "/api/tts",
  icon: "Volume2",
  parameters: [
    {
      name: "text",
      type: "string",
      required: true,
      description: "Teks yang ingin diubah menjadi suara (maksimal 1000 karakter).",
      example: "Halo, selamat datang di SamApi."
    },
    {
      name: "lang",
      type: "string",
      required: false,
      description: "Kode bahasa (id, en, ja, ar, es, fr, ko, zh-CN, dll). Default: id.",
      example: "id"
    }
  ],
  responseExample: {
    status: true,
    source: "Google Translate TTS",
    data: {
      url: "https://files.catbox.moe/abc123.mp3",
      host: "catbox.moe",
      expires: "permanen",
      text: "Halo, selamat datang di SamApi.",
      lang: "id",
      characters: 31,
      chunks: 1,
      filename: "tts-1730000000000.mp3",
      mimetype: "audio/mpeg",
      size: 9216,
      processing_ms: 950
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil, false jika gagal." },
    { name: "source", type: "string", description: "Mesin TTS yang dipakai." },
    { name: "data.url", type: "string", description: "Link file audio MP3." },
    { name: "data.lang", type: "string", description: "Bahasa yang dipakai." },
    { name: "data.characters", type: "number", description: "Jumlah karakter teks." },
    { name: "data.size", type: "number", description: "Ukuran file audio dalam byte." },
    { name: "data.audio_base64", type: "string", description: "Hanya muncul jika server penyimpanan tidak tersedia (audio MP3 dalam base64)." }
  ],
  exampleRequest:
    'curl -X POST "https://samapi.example.com/api/tts" -H "Content-Type: application/json" -d \'{"text":"Halo, selamat datang di SamApi.","lang":"id"}\''
};
