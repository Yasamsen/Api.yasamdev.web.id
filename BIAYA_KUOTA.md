# Biaya kuota per endpoint

Biaya kuota diatur di **metadata tiap endpoint**, bukan di backend.

```js
// src/apis/endpoints/nama-endpoint.js
export default {
  slug: "nama-endpoint",
  cost: 2,            // memakan 2 kuota harian per request. Tanpa field ini = 1.
  name: "...",
  endpoint: "/api/nama-endpoint",
  // ...
};
```

- `cost` harus bilangan bulat 1–100. Nilai lain diabaikan (dipakai 1) dan skrip memberi peringatan.
- Backend membaca peta `api/_quota-map.js` yang dibuat otomatis dari semua metadata oleh
  `scripts/gen-quota-map.mjs`. Peta dibuat ulang setiap `npm run build` dan `npm run dev`;
  manual: `npm run quota`.
- **Jangan menimpa Build Command di Vercel** dengan `vite build` saja. Pakai `npm run build`
  (sudah menjalankan pembuat peta). Kalau `cost` diubah tanpa build, backend masih memakai peta lama.
- Kunci peta adalah nama rute (bagian setelah `/api/`) dan `slug`. Endpoint yang punya alias rute
  di backend (mis. `tts` dan `text-to-speech`) otomatis ikut karena keduanya terdaftar.
- Khusus `web2apk`: hanya langkah build (POST) yang dikenai biaya; cek status & unduh gratis.
- Label "N kuota" muncul otomatis di kartu dan halaman detail endpoint yang `cost`-nya lebih dari 1.
