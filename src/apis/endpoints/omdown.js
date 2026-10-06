export default {
  slug: "omdown",
  name: "Omdown Downloader",
  description:
    "Ambil link download video, audio, atau foto dari 17 platform (TikTok, YouTube, Instagram, Facebook, X, Spotify, SoundCloud, Pinterest, Reddit, CapCut, Threads, Snapchat, Twitch, DeviantArt, Pixiv, MangaDex, PineDrama) lewat satu parameter. Platform dideteksi otomatis dari URL.",
  category: "Downloader",
  method: "GET",
  endpoint: "/api/omdown",
  icon: "Download",
  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "Link konten dari platform yang didukung. Platform dideteksi otomatis.",
      example: "https://www.tiktok.com/@stabilllllll1/video/7392574982087249157"
    }
  ],
  responseExample: {
    status: true,
    source: "Omdown",
    data: {
      platform: "TikTok",
      input_url: "https://www.tiktok.com/@stabilllllll1/video/7392574982087249157",
      links: ["https://..."],
      result: {}
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika berhasil." },
    { name: "source", type: "string", description: "Sumber data (Omdown)." },
    { name: "data.platform", type: "string", description: "Platform yang terdeteksi." },
    { name: "data.input_url", type: "string", description: "URL yang dikirim." },
    { name: "data.links", type: "string[]", description: "Semua URL media yang ditemukan di hasil." },
    { name: "data.result", type: "object", description: "Data mentah dari Omdown." }
  ],
  exampleRequest:
    "https://samapi.example.com/api/omdown?url=https://www.tiktok.com/@stabilllllll1/video/7392574982087249157"
};