export default {
  slug: "quotes-anime",
  name: "Anime Quotes",
  description: "Mengambil satu quote anime secara acak dari OtakuOtaku.",
  category: "Anime",
  method: "GET",
  endpoint: "/api/quotes-anime",
  icon: "Quote",
  parameters: [],
  responseExample: {
    status: true,
    source: "OtakuOtaku",
    data: {
      link: "https://otakotaku.com/quote/example",
      gambar: "https://example.com/image.jpg",
      karakter: "Naruto Uzumaki",
      anime: "Naruto",
      episode: "Episode 1",
      up_at: "2026-09-30",
      quotes: "Example anime quote."
    }
  },
  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Menunjukkan apakah request berhasil."
    },
    {
      name: "source",
      type: "string",
      description: "Nama sumber data."
    },
    {
      name: "data",
      type: "object",
      description: "Data quote anime."
    },
    {
      name: "data.link",
      type: "string",
      description: "URL quote."
    },
    {
      name: "data.gambar",
      type: "string",
      description: "URL gambar quote."
    },
    {
      name: "data.karakter",
      type: "string",
      description: "Nama karakter."
    },
    {
      name: "data.anime",
      type: "string",
      description: "Judul anime."
    },
    {
      name: "data.episode",
      type: "string",
      description: "Informasi episode."
    },
    {
      name: "data.up_at",
      type: "string",
      description: "Informasi waktu quote ditambahkan."
    },
    {
      name: "data.quotes",
      type: "string",
      description: "Isi quote anime."
    }
  ],
  exampleRequest: "https://samapi.example.com/api/quotes-anime"
};