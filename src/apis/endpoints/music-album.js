export default {
  slug: "music-album",
  name: "Music Album",
  description: "Masukkan nama artis, muncul semua lagu/karyanya beserta link MP3 penuh (audio_url dan download_url) untuk tiap lagu. Dicari di Deezer; kalau tidak ada, otomatis dicari di iTunes lalu YouTube sampai ketemu.",
  category: "Music",
  method: "GET",
  endpoint: "/api/music-album",
  icon: "Disc",
  parameters: [
    {
      name: "artist",
      type: "string",
      required: true,
      description: "Nama artis. Mengembalikan semua lagu artis tersebut.",
      example: "Ipank"
    }
  ],
  responseExample: {
    status: true,
    artist: "Ipank",
    source: "Deezer",
    total_tracks: 2,
    audio_ready: 2,
    audio_pending: 0,
    tracks: [
      {
        no: 1,
        track_id: "3135553",
        title: "Contoh Lagu Pertama",
        artist: "Ipank",
        duration_sec: 240,
        filename: "Ipank - Contoh Lagu Pertama.mp3",
        audio_url: "https://example.com/audio/contoh-lagu-pertama.mp3",
        download_url: "https://samapi.example.com/api/music-album?track_id=3135553&redirect=1"
      }
    ]
  },
  responseFields: [
    { name: "status", type: "boolean", description: "Status permintaan." },
    { name: "artist", type: "string", description: "Nama artis yang cocok." },
    { name: "source", type: "string", description: "Sumber daftar lagu yang dipakai: Deezer, iTunes, atau YouTube (urutan fallback)." },
    { name: "total_tracks", type: "number", description: "Jumlah seluruh lagu artis." },
    { name: "audio_ready / audio_pending", type: "number", description: "Jumlah lagu yang audio_url-nya sudah siap / belum sempat diproses dalam batas waktu." },
    { name: "tracks", type: "array", description: "Semua lagu milik artis (judul sama digabung)." },
    { name: "tracks[].audio_url", type: "string", description: "Link MP3 penuh (bukan preview). Bersifat sementara. null jika belum sempat diproses." },
    { name: "tracks[].download_url", type: "string", description: "Selalu ada. Saat dibuka, MP3 penuh dibuat lalu diarahkan (302) ke file-nya." }
  ],
  exampleRequest: "/api/music-album?artist=Ipank"
};
