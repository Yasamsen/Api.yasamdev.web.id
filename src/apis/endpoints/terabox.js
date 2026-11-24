export default {
  slug: "terabox",

  name: "TeraBox Downloader",

  description:
    "Mengekstrak file, thumbnail, stream, subtitle, dan link download dari URL TeraBox.",

  category: "Downloader",

  method: "GET",

  endpoint: "/api/terabox",

  icon:
    "Cloud",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description:
        "URL share TeraBox yang ingin diproses.",
      example:
        "https://1024terabox.com/s/1k2Qxwebz3yI09kubXBf2xA"
    }
  ],

  responseExample: {
    status: true,
    source: "PlayTeraBox",
    data: {
      totalFiles: 1,
      totalFolders: 0,
      files: [
        {
          name: "video.mp4",
          size: "100 MB",
          sizeBytes: 104857600,
          duration: 120,
          quality: "1080p",
          thumbnail: "https://example.com/thumb.jpg",
          downloadLink: "https://example.com/download",
          normalDlink: "https://example.com/normal",
          fastStreamUrl: "https://example.com/stream",
          subtitleUrl: null
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
      description: "Sumber resolver."
    },
    {
      name: "data.totalFiles",
      type: "number",
      description: "Jumlah file."
    },
    {
      name: "data.totalFolders",
      type: "number",
      description: "Jumlah folder."
    },
    {
      name: "data.files",
      type: "array",
      description: "Daftar file TeraBox."
    },
    {
      name: "data.files[].name",
      type: "string",
      description: "Nama file."
    },
    {
      name: "data.files[].size",
      type: "string",
      description: "Ukuran file."
    },
    {
      name: "data.files[].sizeBytes",
      type: "number",
      description: "Ukuran file dalam byte."
    },
    {
      name: "data.files[].duration",
      type: "number",
      description: "Durasi file jika tersedia."
    },
    {
      name: "data.files[].quality",
      type: "string",
      description: "Kualitas video jika tersedia."
    },
    {
      name: "data.files[].thumbnail",
      type: "string",
      description: "URL thumbnail."
    },
    {
      name: "data.files[].downloadLink",
      type: "string",
      description: "Link download."
    },
    {
      name: "data.files[].normalDlink",
      type: "string",
      description: "Direct download link normal."
    },
    {
      name: "data.files[].fastStreamUrl",
      type: "string",
      description: "URL streaming cepat."
    },
    {
      name: "data.files[].subtitleUrl",
      type: "string",
      description: "URL subtitle jika tersedia."
    }
  ],

  exampleRequest:
    "/api/terabox?url=https%3A%2F%2F1024terabox.com%2Fs%2F1k2Qxwebz3yI09kubXBf2xA"
};