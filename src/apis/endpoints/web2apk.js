
export default {
  slug: "web2apk",
  name: "Web2APK Builder",
  description:
    "Membuat aplikasi Android APK dari website melalui layanan Web2APK dan menyediakan ZIP hasil build.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/web2apk",
  icon: "Smartphone",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "URL HTTPS website yang akan dijadikan aplikasi Android.",
      example: "https://contoh.com"
    },
    {
      name: "appName",
      type: "string",
      required: true,
      description: "Nama aplikasi Android, maksimal 40 karakter.",
      example: "Aplikasi Saya"
    },
    {
      name: "iconUrl",
      type: "string",
      required: false,
      description:
        "URL HTTPS ikon aplikasi dalam format gambar yang didukung builder.",
      example: "https://contoh.com/icon.png"
    }
  ],

  responseExample: {
    status: true,
    source: "Web2APK",
    data: {
      state: "queued",
      packageName: "com.yasam.acak.k4m8x2q9",
      appName: "Aplikasi Saya",
      statusUrl:
        "/api/web2apk?after=2026-10-17T10%3A00%3A00.000Z",
      message:
        "Website Web2APK telah menerima permintaan build."
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Menunjukkan apakah permintaan berhasil diproses."
    },
    {
      name: "source",
      type: "string",
      description: "Nama layanan sumber pembuat APK."
    },
    {
      name: "data.state",
      type: "string",
      description: "Status proses build, misalnya queued atau success."
    },
    {
      name: "data.packageName",
      type: "string",
      description: "Package ID acak dengan prefix com.yasam.acak."
    },
    {
      name: "data.appName",
      type: "string",
      description: "Nama aplikasi yang diminta."
    },
    {
      name: "data.statusUrl",
      type: "string",
      description: "URL untuk memeriksa status build."
    },
    {
      name: "data.downloadUrl",
      type: "string",
      description: "URL untuk mengunduh ZIP ketika build selesai."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/web2apk"
};
