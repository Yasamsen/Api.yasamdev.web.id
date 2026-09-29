export default {
  slug: "lyrics",
  name: "Lyrics",
  description: "Mencari lirik lagu menggunakan LRCLIB, termasuk lirik plain dan tersinkronisasi.",
  category: "Music",
  method: "GET",
  endpoint: "/api/lyrics",
  icon: "Music",

  parameters: [
    {
      name: "q",
      type: "string",
      required: true,
      description: "Judul lagu atau URL Spotify.",
      example: "Shape of You"
    },
    {
      name: "artist",
      type: "string",
      required: false,
      description: "Nama artis atau penyanyi.",
      example: "Ed Sheeran"
    }
  ],

  responseExample: {
    status: true,
    source: "LRCLIB",
    data: {
      trackName: "Shape of You",
      artistName: "Ed Sheeran",
      albumName: "÷ (Deluxe)",
      duration: 233,
      plainLyrics: "The club isn't the best place...",
      syncedLyrics: "[00:00.00] The club isn't the best place..."
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status permintaan."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber data lirik."
    },
    {
      name: "data.trackName",
      type: "string",
      description: "Judul lagu."
    },
    {
      name: "data.artistName",
      type: "string",
      description: "Nama artis."
    },
    {
      name: "data.albumName",
      type: "string",
      description: "Nama album."
    },
    {
      name: "data.duration",
      type: "number",
      description: "Durasi lagu dalam detik."
    },
    {
      name: "data.plainLyrics",
      type: "string",
      description: "Lirik tanpa timestamp."
    },
    {
      name: "data.syncedLyrics",
      type: "string",
      description: "Lirik dengan timestamp format LRC."
    }
  ],

  exampleRequest: "/api/lyrics?q=Shape%20of%20You&artist=Ed%20Sheeran"
};