export default {
  slug: "web2apk",
  name: "Web to APK",
  description: "Ubah website HTTPS menjadi APK Android (WebView debug). POST untuk memulai build, GET dengan id untuk mengecek status, lalu GET dengan download=1 untuk mengambil file ZIP berisi app-debug.apk.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/web2apk",
  icon: "Smartphone",
  parameters: [
    { name: "url", type: "string", required: true, description: "URL website HTTPS yang dijadikan APK (POST)", example: "https://example.com" },
    { name: "appName", type: "string", required: true, description: "Nama aplikasi, maksimal 40 karakter (POST)", example: "Contoh App" },
    { name: "packageName", type: "string", required: true, description: "Package ID: huruf kecil dan angka dipisah titik (POST)", example: "com.contoh.app" },
    { name: "iconUrl", type: "string", required: false, description: "URL ikon PNG/JPG HTTPS, maksimal 2 MB (POST)", example: "https://example.com/icon.png" },
    { name: "id", type: "string", required: false, description: "buildId hasil POST, dipakai pada GET untuk cek status", example: "2026-10-20T10:00:00.000Z" },
    { name: "download", type: "string", required: false, description: "Isi 1 (bersama id) pada GET untuk mengunduh ZIP", example: "1" }
  ],
  responseExample: {
    status: true,
    source: "Web2APK",
    data: {
      buildId: "2026-10-20T10:00:00.000Z",
      state: "success",
      message: "APK siap diunduh.",
      downloadUrl: "https://apk-82rl.vercel.app/api/download",
      zipEndpoint: "/api/web2apk?id=2026-10-20T10:00:00.000Z&download=1"
    }
  },
  responseFields: [
    { name: "buildId", type: "string", description: "Penanda waktu build, dipakai sebagai id pada GET" },
    { name: "state", type: "string", description: "waiting, queued, in_progress, success, failed, atau ready-expired" },
    { name: "message", type: "string", description: "Pesan status dari server build" },
    { name: "actionsUrl", type: "string|null", description: "Link log build di GitHub Actions" },
    { name: "downloadUrl", type: "string|null", description: "Link ZIP langsung, terisi saat state success" },
    { name: "zipEndpoint", type: "string|null", description: "Path endpoint ini untuk mengunduh ZIP, terisi saat state success" }
  ],
  exampleRequest: "curl -X POST https://samapi.example.com/api/web2apk -H 'Content-Type: application/json' -d '{\"url\":\"https://example.com\",\"appName\":\"Contoh App\",\"packageName\":\"com.contoh.app\"}'"
};