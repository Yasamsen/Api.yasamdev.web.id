export default {
  slug: "facebook",

  name: "Facebook Downloader",

  description:
    "Mengambil metadata dan link download video Facebook.",

  category: "Downloader",

  method: "GET",

  endpoint: "/api/facebook",

  icon: "Facebook",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description:
        "URL video Facebook yang ingin diproses.",
      example:
        "https://www.facebook.com/share/r/1Be7n8L1MV/"
    }
  ],

  responseExample: {
    status: true,
    source: "Facebook Downloader",
    data: {
      creator: "IkyyEzz",

      metadata: {
        title: "Facebook Video",
        author: "Username",
        abstract: "Video Facebook",
        duration: "30s",
        view_count: 1000,
        comment_count: 20,
        like_count: 100,
        published_at:
          "2026-09-28T13:00:00.000Z",
        resolution: "720p"
      },

      downloads: {
        thumbnail:
          "https://example.com/thumbnail.jpg",

        links: [
          {
            quality: "HD",
            type: "MP4",
            url:
              "https://example.com/video.mp4"
          }
        ]
      }
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description:
        "Menunjukkan apakah request berhasil."
    },
    {
      name: "source",
      type: "string",
      description:
        "Nama sumber downloader."
    },
    {
      name: "data.creator",
      type: "string",
      description:
        "Nama creator API."
    },
    {
      name: "data.metadata",
      type: "object",
      description:
        "Metadata video Facebook."
    },
    {
      name: "data.metadata.title",
      type: "string|null",
      description:
        "Judul video."
    },
    {
      name: "data.metadata.author",
      type: "string|null",
      description:
        "Pemilik atau author video."
    },
    {
      name: "data.metadata.abstract",
      type: "string|null",
      description:
        "Deskripsi atau ringkasan video."
    },
    {
      name: "data.metadata.duration",
      type: "string|null",
      description:
        "Durasi video."
    },
    {
      name: "data.metadata.view_count",
      type: "number",
      description:
        "Jumlah tayangan."
    },
    {
      name: "data.metadata.comment_count",
      type: "number",
      description:
        "Jumlah komentar."
    },
    {
      name: "data.metadata.like_count",
      type: "number",
      description:
        "Jumlah like."
    },
    {
      name: "data.metadata.published_at",
      type: "string|null",
      description:
        "Waktu publikasi video dalam ISO 8601."
    },
    {
      name: "data.metadata.resolution",
      type: "string|null",
      description:
        "Resolusi video."
    },
    {
      name: "data.downloads.thumbnail",
      type: "string|null",
      description:
        "URL thumbnail video."
    },
    {
      name: "data.downloads.links",
      type: "array",
      description:
        "Daftar link download video."
    },
    {
      name: "data.downloads.links[].quality",
      type: "string",
      description:
        "Kualitas video."
    },
    {
      name: "data.downloads.links[].type",
      type: "string",
      description:
        "Format atau tipe media."
    },
    {
      name: "data.downloads.links[].url",
      type: "string",
      description:
        "URL download media."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/facebook?url=https://www.facebook.com/share/r/1Be7n8L1MV/"
};