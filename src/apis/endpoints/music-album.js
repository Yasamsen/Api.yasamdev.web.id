export default {
  slug: "music-album",
  name: "Music Album",
  description: "Cukup masukkan nama artis: muncul semua album dan semua lagunya, lengkap dengan download_url siap unduh MP3 untuk tiap lagu. Bisa juga per album (album_id) atau per lagu (track_id).",
  category: "Music",
  method: "GET",
  endpoint: "/api/music-album",
  icon: "Disc",
  parameters: [
    {
      name: "artist",
      type: "string",
      required: false,
      description: "Nama artis. Mengembalikan semua album + semua lagu artis tersebut. Wajib diisi jika album_id / track_id kosong.",
      example: "Ipank"
    },
    {
      name: "album_id",
      type: "string",
      required: false,
      description: "Alternatif artist: tampilkan lagu satu album saja (pakai album_id dari hasil sebelumnya).",
      example: "302127"
    },
    {
      name: "track_id",
      type: "string",
      required: false,
      description: "Ambil MP3 satu lagu. Respons JSON berisi audio_url. Tambah redirect=1 untuk langsung diarahkan ke file MP3.",
      example: "3135553"
    },
    {
      name: "resolve",
      type: "string",
      required: false,
      description: "Nomor urut lagu (contoh: 3) atau rentang (contoh: 1-5, maksimal 5) yang langsung dibuatkan audio_url di dalam daftar.",
      example: "1-3"
    },
    {
      name: "max_albums",
      type: "number",
      required: false,
      description: "Batas jumlah album yang dibaca per artis (1–100). Default 40.",
      example: 40
    },
    {
      name: "dedupe",
      type: "select",
      required: false,
      description: "true (default) menggabungkan lagu dengan judul sama yang muncul di beberapa album/single.",
      options: [
        { label: "Ya (default)", value: "true" },
        { label: "Tidak, tampilkan semua versi", value: "false" }
      ],
      example: "true"
    }
  ],
  responseExample: {
    status: true,
    source: "Deezer + YouTube",
    data: {
      query: "Ipank",
      artist: { artist_id: "123", name: "Ipank", picture_url: "https://cdn-images.dzcdn.net/images/artist/xxxx/1000x1000-000000-80-0-0.jpg", fans: 1000, artist_url: "https://www.deezer.com/artist/123" },
      other_matches: [],
      total_albums: 2,
      total_tracks: 2,
      albums: [
        { album_id: "302127", album_name: "Contoh Album", album_type: "album", release_date: "2010-01-01", total_tracks: 2, cover_url: "https://cdn-images.dzcdn.net/images/cover/xxxx/1000x1000-000000-80-0-0.jpg", album_url: "https://www.deezer.com/album/302127", album_endpoint: "https://samapi.example.com/api/music-album?album_id=302127" }
      ],
      tracks: [
        {
          no: 1,
          track_id: "3135553",
          title: "Contoh Lagu Pertama",
          artist: "Ipank",
          album_id: "302127",
          album_name: "Contoh Album",
          release_date: "2010-01-01",
          duration_sec: 240,
          explicit: false,
          cover_url: "https://cdn-images.dzcdn.net/images/cover/xxxx/1000x1000-000000-80-0-0.jpg",
          preview_url: "https://cdnt-preview.dzcdn.net/api/1/1/x.mp3",
          track_url: "https://www.deezer.com/track/3135553",
          filename: "Ipank - Contoh Lagu Pertama.mp3",
          download_url: "https://samapi.example.com/api/music-album?track_id=3135553&redirect=1",
          json_url: "https://samapi.example.com/api/music-album?track_id=3135553"
        }
      ],
      how_to_download: "Buka download_url tiap lagu untuk langsung mengunduh MP3 (diarahkan 302), atau json_url untuk mendapat audio_url dalam JSON.",
      generated_at: "2026-10-25T00:00:00.000Z"
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "Status permintaan." },
    { name: "data.artist", type: "object", description: "Artis yang cocok: artist_id, name, foto, jumlah fans." },
    { name: "data.other_matches", type: "array", description: "Artis lain dengan nama mirip. Pakai artist_id jika yang terpilih bukan yang dimaksud." },
    { name: "data.albums", type: "array", description: "Semua album/EP/single artis: album_id, nama, tipe, tanggal rilis, cover." },
    { name: "data.tracks", type: "array", description: "Semua lagu artis (diurutkan per album), tiap lagu berisi nomor urut, judul, album, durasi, dan preview 30 detik." },
    { name: "data.tracks[].download_url", type: "string", description: "Link siap unduh: saat dibuka, MP3 dibuat lalu browser diarahkan (302) ke file-nya." },
    { name: "data.tracks[].json_url", type: "string", description: "Sama seperti download_url, tetapi hasilnya JSON berisi audio_url dan info YouTube." },
    { name: "data.tracks[].audio_url", type: "string", description: "Link MP3 langsung. Hanya ada pada lagu yang diminta lewat resolve. Bersifat sementara." },
    { name: "data.resolved", type: "object", description: "Ringkasan requested / succeeded / failed jika parameter resolve dipakai." }
  ],
  exampleRequest: "/api/music-album?artist=Ipank"
};
