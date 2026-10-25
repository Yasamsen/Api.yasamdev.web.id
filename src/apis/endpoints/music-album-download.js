export default {
  slug: "music-album-download",
  name: "Music Album Download",
  description: "Lihat daftar lagu sebuah album, lalu ambil link MP3 per lagu (atau batch hingga 5 lagu). Pakai album_id dari Music Album Search.",
  category: "Music",
  method: "GET",
  endpoint: "/api/music-album-download",
  icon: "ListMusic",
  parameters: [
    {
      name: "id",
      type: "string",
      required: false,
      description: "album_id dari hasil Music Album Search. Wajib diisi jika query kosong.",
      example: "302127"
    },
    {
      name: "query",
      type: "string",
      required: false,
      description: "Alternatif id: nama album/artis. Album pertama yang cocok akan dipakai.",
      example: "Ipank"
    },
    {
      name: "track",
      type: "string",
      required: false,
      description: "Nomor lagu (contoh: 3) atau rentang (contoh: 1-5, maksimal 5 lagu per request). Kosongkan untuk melihat daftar lagu album.",
      example: "1-3"
    }
  ],
  responseExample: {
    status: true,
    source: "Deezer + YouTube",
    data: {
      album: {
        album_id: "302127",
        album_name: "Contoh Album",
        artist: "Contoh Artis",
        cover_url: "https://cdn-images.dzcdn.net/images/cover/xxxx/1000x1000-000000-80-0-0.jpg",
        total_tracks: 12
      },
      requested: 2,
      succeeded: 1,
      failed: 1,
      tracks: [
        {
          no: 1,
          track_id: "3135553",
          title: "Contoh Lagu Pertama",
          artist: "Contoh Artis",
          duration_sec: 240,
          filename: "Contoh Artis - Contoh Lagu Pertama.mp3",
          audio_url: "https://example.com/audio/contoh-lagu-pertama.mp3",
          youtube: {
            video_id: "dQw4w9WgXcQ",
            title: "Contoh Artis - Contoh Lagu Pertama (Official Audio)",
            channel: "Contoh Artis",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        },
        {
          no: 2,
          track_id: "3135554",
          title: "Contoh Lagu Kedua",
          artist: "Contoh Artis",
          error: "Versi audio yang cocok tidak ditemukan di YouTube."
        }
      ]
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "true jika minimal satu lagu berhasil diproses." },
    { name: "data.album", type: "object", description: "Info album: nama, artis, cover, dan jumlah lagu (saat track diisi). Tanpa track, berisi detail lengkap + label + genre." },
    { name: "data.tracks", type: "array", description: "Tanpa track: daftar semua lagu + track_endpoint. Dengan track: hasil tiap lagu yang diminta." },
    { name: "data.tracks[].track_endpoint", type: "string", description: "Endpoint untuk mengambil MP3 lagu tersebut (hanya pada daftar lagu)." },
    { name: "data.tracks[].audio_url", type: "string", description: "Link MP3 lagu. Bersifat sementara, segera unduh." },
    { name: "data.tracks[].filename", type: "string", description: "Saran nama file untuk disimpan." },
    { name: "data.tracks[].error", type: "string", description: "Alasan gagal jika lagu tidak berhasil diproses (lagu lain tetap jalan)." },
    { name: "data.requested / succeeded / failed", type: "number", description: "Ringkasan jumlah lagu pada request batch." }
  ],
  exampleRequest: "/api/music-album-download?id=302127&track=1-3"
};
