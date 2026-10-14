export default {
  slug: "album-search",
  name: "Album Search",
  description: "Membaca judul album, tautan lagu, dan tautan media yang dipublikasikan pada halaman album Centralagu.",
  category: "Music",
  method: "GET",
  endpoint: "/api/album-search",
  icon: "Music",
  parameters: [
    { name: "url", type: "string", required: false, description: "URL halaman album Centralagu yang didukung.", example: "https://centralagu.blogspot.com/2018/07/album-tembang-nostalgia-mp3.html?m=1" }
  ],
  responseExample: { status: true, source: "https://centralagu.blogspot.com/2018/07/album-tembang-nostalgia-mp3.html?m=1", title: "Album Tembang Nostalgia MP3", tracks: [], availableMediaLinks: [], counts: { tracks: 0, mediaLinks: 0 } },
  responseFields: [
    { name: "status", type: "boolean", description: "Status permintaan." },
    { name: "title", type: "string", description: "Judul halaman album." },
    { name: "tracks", type: "array", description: "Tautan terkait lagu yang ditemukan pada halaman." },
    { name: "availableMediaLinks", type: "array", description: "Tautan audio atau arsip langsung yang dipublikasikan pada halaman." },
    { name: "counts", type: "object", description: "Jumlah tautan yang ditemukan." }
  ],
  exampleRequest: "/api/album-search?url=https%3A%2F%2Fcentralagu.blogspot.com%2F2018%2F07%2Falbum-tembang-nostalgia-mp3.html%3Fm%3D1"
};
