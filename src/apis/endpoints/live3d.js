export default {
  slug: "live3d",
  name: "Live3D",
  description:
    "Scraper Live3D untuk mengambil data VTuber Models, Assets, Backgrounds, Animations, dan daftar AI Tools.",

  category: "Scraper",
  method: "GET",
  endpoint: "/api/live3d",
  icon: "Box",

  parameters: [
    {
      name: "category",
      type: "string",
      required: false,
      description:
        "Kategori data: all, models, assets, backgrounds, animations, atau ai-tools. Default: all.",
      example: "models"
    }
  ],

  responseExample: {
    status: true,
    source: "Live3D",
    data: {
      category: "backgrounds",
      scraped_at: "2026-11-15T10:00:00.000Z",
      result: {
        total: 1,
        items: [
          {
            title: "VTuber Background",
            type: "Animated Stream Background (GIF)",
            url: "https://live3d.io/saasbox/resources/gif/example.gif"
          }
        ]
      }
    }
  },

  responseFields: [
    { name: "status", type: "boolean", description: "Status request." },
    { name: "source", type: "string", description: "Nama sumber data." },
    { name: "data.category", type: "string", description: "Kategori yang diminta." },
    { name: "data.scraped_at", type: "string", description: "Waktu scraping (ISO 8601)." },
    { name: "data.result", type: "object", description: "Hasil scraping sesuai kategori. Struktur berbeda per kategori." }
  ],

  exampleRequest: "https://samapi.example.com/api/live3d?category=models"
};