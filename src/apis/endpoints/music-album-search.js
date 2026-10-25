export default {
  slug: "music-album-search",
  name: "Music Album Search",
  description: "Cari album atau lagu dari kata kunci / nama artis. Hasilnya berisi cover, artis, jumlah lagu, dan album_id untuk dipakai di Music Album Download.",
  category: "Music",
  method: "GET",
  endpoint: "/api/music-album-search",
  icon: "Disc",
  parameters: [
    {
      name: "query",
      type: "string",
      required: true,
      description: "Kata kunci, judul album, atau nama artis yang ingin dicari.",
      example: "Ipank"
    },
    {
      name: "type",
      type: "select",
      required: false,
      description: "Jenis hasil: album (default), track untuk lagu, atau all untuk keduanya.",
      options: [
        { label: "Album", value: "album" },
        { label: "Track", value: "track" },
        { label: "All (album + track)", value: "all" }
      ],
      example: "album"
    },
    {
      name: "limit",
      type: "number",
      required: false,
      description: "Jumlah hasil (1–10). Default 10.",
      example: 5
    },
    {
      name: "tracks",
      type: "select",
      required: false,
      description: "Isi true untuk menampilkan daftar lagu di setiap album (sedikit lebih lambat).",
      options: [
        { label: "Tidak (lebih cepat)", value: "false" },
        { label: "Ya, tampilkan daftar lagu", value: "true" }
      ],
      example: "false"
    }
  ],
  responseExample: {
    status: true,
    source: "Deezer",
    data: {
      query: "Ipank",
      type: "album",
      limit: 5,
      total_albums: 1,
      total_tracks: 0,
      albums: [
        {
          album_id: "123456",
          album_name: "Contoh Album",
          artist: "Ipank",
          album_type: "album",
          total_tracks: 12,
          release_date: null,
          label: null,
          genres: [],
          duration_sec: null,
          explicit: false,
          cover_url: "https://cdn-images.dzcdn.net/images/cover/xxxx/1000x1000-000000-80-0-0.jpg",
          album_url: "https://www.deezer.com/album/123456",
          album_endpoint: "https://samapi.example.com/api/music-album-download?id=123456"
        }
      ],
      tracks: [],
      generated_at: "2026-10-25T00:00:00.000Z"
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "Status permintaan." },
    { name: "source", type: "string", description: "Sumber metadata (Deezer)." },
    { name: "data.albums", type: "array", description: "Daftar album: album_id, album_name, artist, total_tracks, cover_url, dan album_endpoint." },
    { name: "data.albums[].album_id", type: "string", description: "ID album. Pakai di parameter id pada Music Album Download." },
    { name: "data.albums[].tracks", type: "array", description: "Daftar lagu album (hanya muncul jika tracks=true)." },
    { name: "data.tracks", type: "array", description: "Hasil lagu jika type=track atau type=all, lengkap dengan preview_url 30 detik." }
  ],
  exampleRequest: "/api/music-album-search?query=Ipank&type=album&limit=5"
};
