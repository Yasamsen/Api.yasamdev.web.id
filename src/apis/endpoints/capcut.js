export default {
  slug: "capcut",

  name: "CapCut Downloader",

  description:
    "Mengambil metadata template CapCut tanpa menggunakan API resmi.",

  category: "Downloader",

  method: "GET",

  endpoint: "/api/capcut",

  icon: "Scissors",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description:
        "URL template CapCut yang ingin diambil datanya.",

      example:
        "https://www.capcut.com/tv2/ZSVEwBgtH/"
    }
  ],

  responseExample: {
    status: true,
    source: "CapCut",
    data: {
      id: "template_id",
      title: "CapCut Template",
      description: "Template description",
      hashtags: ["#template"],
      coverUrl: "https://example.com/cover.jpg",
      videoUrl: "https://example.com/video.mp4",
      videoWidth: 1080,
      videoHeight: 1920,
      videoRatio: "1080:1920",
      durationMs: 15000,
      durationSec: 15,
      usageCount: 1000,
      likeCount: 500,
      playCount: 10000,
      commentCount: 50
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description:
        "Status keberhasilan request."
    },
    {
      name: "source",
      type: "string",
      description:
        "Sumber data."
    },
    {
      name: "data",
      type: "object",
      description:
        "Informasi template CapCut."
    },
    {
      name: "data.id",
      type: "string",
      description:
        "ID template CapCut."
    },
    {
      name: "data.title",
      type: "string",
      description:
        "Judul template."
    },
    {
      name: "data.description",
      type: "string",
      description:
        "Deskripsi template."
    },
    {
      name: "data.coverUrl",
      type: "string",
      description:
        "URL thumbnail template."
    },
    {
      name: "data.videoUrl",
      type: "string",
      description:
        "URL video template."
    },
    {
      name: "data.author",
      type: "object",
      description:
        "Informasi pembuat template."
    },
    {
      name: "data.recommendList",
      type: "array",
      description:
        "Daftar template rekomendasi jika tersedia."
    }
  ],

  exampleRequest:
    "/api/capcut?url=https://www.capcut.com/tv2/ZSVEwBgtH/"
};