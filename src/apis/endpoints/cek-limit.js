export default {
  slug: "cek-limit",
  name: "Cek Limit",
  description: "Cek sisa kuota harian dan detail pemilik API key. Endpoint ini tidak memakai kuota.",
  category: "Utility",
  method: "GET",
  endpoint: "/api/cek-limit",
  icon: "Gauge",
  public: true,

  parameters: [
    {
      name: "apikey",
      type: "string",
      required: true,
      description: "API key pribadi kamu (diawali sam_). Lihat di halaman Profil setelah login.",
      example: "sam_xxxxxxxxxxxxxxxxxxxxxxxx"
    }
  ],

  responseExample: {
    status: true,
    data: {
      username: "Budi Santoso",
      email: "bu****@gmail.com",
      banned: false,
      limit: {
        daily: 100,
        used: 27,
        remaining: 73,
        percent_used: 27,
        reset_in_seconds: 18240,
        reset_at: "2026-11-13T17:00:00.000Z",
        timezone: "Asia/Jakarta"
      },
      total_requests: 512,
      member_since: "2026-11-01T08:12:00.000Z"
    }
  },

  responseFields: [
    { name: "status", type: "boolean", description: "true jika key valid." },
    { name: "data.username", type: "string", description: "Nama akun Google pemilik key." },
    { name: "data.email", type: "string", description: "Email pemilik (sebagian disensor)." },
    { name: "data.banned", type: "boolean", description: "true jika akun diblokir admin." },
    { name: "data.limit.daily", type: "number", description: "Batas request per hari." },
    { name: "data.limit.used", type: "number", description: "Request yang sudah terpakai hari ini." },
    { name: "data.limit.remaining", type: "number", description: "Sisa request hari ini." },
    { name: "data.limit.percent_used", type: "number", description: "Persentase kuota terpakai." },
    { name: "data.limit.reset_in_seconds", type: "number", description: "Detik sampai kuota di-reset (tengah malam WIB)." },
    { name: "data.limit.reset_at", type: "string", description: "Waktu reset kuota (ISO 8601)." },
    { name: "data.total_requests", type: "number", description: "Total seluruh request sejak bergabung." },
    { name: "data.member_since", type: "string", description: "Tanggal akun dibuat." }
  ],

  exampleRequest: "GET https://api.yasamdev.web.id/api/cek-limit?apikey=sam_xxxxxxxxxxxxxxxxxxxxxxxx"
};
