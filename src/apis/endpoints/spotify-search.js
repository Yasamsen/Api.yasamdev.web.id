export default {
  "slug": "spotify-search",
  "name": "Spotify Album & Track Search",
  "description": "Cari album dan lagu di Spotify berdasarkan kata kunci atau nama artis, serta tampilkan daftar lagu pada setiap album.",
  "category": "Music",
  "method": "GET",
  "endpoint": "/api/spotify-search",
  "icon": "Music",
  "parameters": [
    {
      "name": "query",
      "type": "string",
      "required": true,
      "description": "Kata kunci atau nama artis yang ingin dicari.",
      "example": "Ipank"
    },
    {
      "name": "type",
      "type": "select",
      "required": false,
      "description": "Jenis hasil: album untuk album beserta track-nya, track untuk hasil lagu, atau all untuk keduanya.",
      "options": [
        {
          "label": "Album",
          "value": "album"
        },
        {
          "label": "Track",
          "value": "track"
        },
        {
          "label": "All (album + track)",
          "value": "all"
        }
      ],
      "example": "album"
    },
    {
      "name": "limit",
      "type": "number",
      "required": false,
      "description": "Jumlah hasil pencarian (1–10). Default 10.",
      "example": 10
    }
  ],
  "responseExample": {
    "status": true,
    "source": "Spotify",
    "data": {
      "query": "Ipank",
      "type": "album",
      "source": "open.spotify.com",
      "generated_at": "2026-10-24T00:00:00.000Z",
      "albums": [
        {
          "album_name": "Contoh Album Ipank",
          "album_id": "contohAlbumId",
          "album_type": "album",
          "album_url": "https://open.spotify.com/album/contohAlbumId",
          "cover_url": "https://example.com/cover.jpg",
          "release_date": "2020-01-01",
          "artist": "Ipank",
          "total_tracks": 2,
          "tracks": [
            {
              "title": "Contoh Lagu Pertama",
              "artist": "Ipank",
              "duration_ms": 240000,
              "track_id": "contohTrackId1",
              "track_url": "https://open.spotify.com/track/contohTrackId1"
            },
            {
              "title": "Contoh Lagu Kedua",
              "artist": "Ipank",
              "duration_ms": 215000,
              "track_id": "contohTrackId2",
              "track_url": "https://open.spotify.com/track/contohTrackId2"
            }
          ]
        }
      ],
      "tracks": []
    }
  },
  "responseFields": [
    {
      "name": "status",
      "type": "boolean",
      "description": "Status permintaan."
    },
    {
      "name": "source",
      "type": "string",
      "description": "Sumber metadata, yaitu Spotify."
    },
    {
      "name": "data.query",
      "type": "string",
      "description": "Kata kunci yang dicari."
    },
    {
      "name": "data.type",
      "type": "string",
      "description": "Tipe pencarian: album, track, atau all."
    },
    {
      "name": "data.albums",
      "type": "array",
      "description": "Hasil album, termasuk informasi album dan daftar track pada setiap album."
    },
    {
      "name": "data.tracks",
      "type": "array",
      "description": "Hasil lagu jika type=track atau type=all."
    },
    {
      "name": "data.generated_at",
      "type": "string",
      "description": "Waktu respons dibuat dalam format ISO 8601."
    }
  ],
  "exampleRequest": "/api/spotify-search?query=Ipank&type=album&limit=10"
};
