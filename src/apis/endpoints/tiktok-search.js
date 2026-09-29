export default {
  slug: "tiktok-search",

  name: "TikTok Search",

  description:
    "Mencari video TikTok berdasarkan kata kunci menggunakan GetDL.",

  category: "Search",

  method: "GET",

  endpoint: "/api/tiktok-search",

  icon: "https://www.google.com/s2/favicons?domain=tiktok.com&sz=128",

  parameters: [
    {
      name: "q",
      type: "string",
      required: true,
      description: "Kata kunci pencarian TikTok.",
      example: "Supra MK4"
    },
    {
      name: "count",
      type: "number",
      required: false,
      description:
        "Jumlah hasil pencarian. Default 10, maksimum 50.",
      example: "10"
    },
    {
      name: "region",
      type: "string",
      required: false,
      description:
        "Region pencarian TikTok.",
      example: "ID"
    }
  ],

  responseExample: {
    status: true,
    source: "GetDL",
    data: {
      query: "Supra MK4",
      region: "ID",
      total_results: 100,
      has_more: true,
      count: 10,
      results: [
        {
          index: 1,
          title: "Toyota Supra MK4",
          duration: "25s",
          play_url:
            "https://example.com/video.mp4",
          cover_url:
            "https://example.com/cover.jpg",
          created_at:
            "28/09/2026 16.20.00"
        }
      ]
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status request."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber data."
    },
    {
      name: "data",
      type: "object",
      description: "Data hasil pencarian."
    },
    {
      name: "data.query",
      type: "string",
      description: "Kata kunci yang digunakan."
    },
    {
      name: "data.region",
      type: "string",
      description: "Region pencarian."
    },
    {
      name: "data.total_results",
      type: "number",
      description:
        "Jumlah total hasil yang tersedia."
    },
    {
      name: "data.has_more",
      type: "boolean",
      description:
        "Menunjukkan apakah masih tersedia hasil lainnya."
    },
    {
      name: "data.count",
      type: "number",
      description:
        "Jumlah hasil yang dikembalikan."
    },
    {
      name: "data.results",
      type: "array",
      description:
        "Daftar hasil video TikTok."
    },
    {
      name: "data.results[].index",
      type: "number",
      description:
        "Nomor urut hasil."
    },
    {
      name: "data.results[].title",
      type: "string",
      description:
        "Judul video."
    },
    {
      name: "data.results[].duration",
      type: "string",
      description:
        "Durasi video."
    },
    {
      name: "data.results[].play_url",
      type: "string",
      description:
        "URL video."
    },
    {
      name: "data.results[].cover_url",
      type: "string",
      description:
        "URL thumbnail video."
    },
    {
      name: "data.results[].created_at",
      type: "string",
      description:
        "Waktu video dibuat."
    }
  ],

  exampleRequest:
    "/api/tiktok-search?q=Supra%20MK4&count=10&region=ID"
};