# Auto-detected API endpoints

Tambahkan endpoint baru sebagai file `.js` di folder ini atau subfolder-nya. Tidak perlu mengedit `registry.js`.

Contoh:

```js
export default {
  slug: 'facebook',
  name: 'Facebook Downloader',
  description: 'Download Facebook media.',
  category: 'Downloader',
  method: 'GET',
  endpoint: '/api/download/facebook',
  icon: 'Facebook',
  parameters: [
    {
      name: 'url',
      type: 'string',
      required: true,
      description: 'URL Facebook.',
      example: 'https://www.facebook.com/...'
    }
  ],
  responseExample: { success: true, data: {} },
  responseFields: [],
  exampleRequest: 'https://samapi.example.com/api/download/facebook?url=...'
};
```

Subfolder juga otomatis terdeteksi, misalnya `download/facebook.js`.

Jika field dokumentasi tidak lengkap, registry akan mengisi nilai dasar secara otomatis. Untuk dokumentasi yang sama lengkapnya dengan endpoint lama, isi metadata seperti contoh di atas.


## Endpoint `add-subdomain` (Cloudflare)

Endpoint ini memakai `POST /api/add-subdomain` dan membuat record DNS di Cloudflare.
Atur environment variables berikut di Vercel (Project → Settings → Environment Variables):

- `ROOT_DOMAIN`: domain utama, misalnya `example.com` (tanpa protokol).
- `CLOUDFLARE_ZONE_ID`: Zone ID domain tersebut.
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token dengan izin **Zone → DNS → Edit** untuk zone yang dipilih.
- `ADD_SUBDOMAIN_API_KEY`: kunci rahasia acak yang hanya dibagikan ke pemanggil endpoint.

Kirim API key lewat header `x-api-key`. Body JSON berisi `subdomain` (label saja, misalnya `panel`), `type` (`A`, `AAAA`, `CNAME`, `TXT`), `content`, opsional `ttl`, dan `proxied` (`true`/`false`). Jangan pernah menaruh token Cloudflare di frontend atau di metadata endpoint.


## Endpoint `check-host`

`POST /api/check-host` — tanpa API key. Body JSON: `{"url":"example.com"}`, opsional `checks` (`dns,ip,http,https,ports,whois,security`) dan `ports` (port umum saja).
Tidak butuh environment variable. IP privat/internal diblokir (anti-SSRF), ada rate limit 15 request/menit per IP, dan total waktu dibatasi ±9 detik.


## Kategori (otomatis & rapi)

Kategori ditampilkan dari `src/categories.js`, bukan dari teks `category` mentah di tiap file. Jadi 24 label lama
(Tools, Utility, Information, Media, Image, ...) dirapikan menjadi 11 kategori yang jelas.

- **Endpoint baru** — cukup isi `category` seperti biasa. Nilai yang dikenal (mis. `Downloader`, `AI`, `Music`, `Tools`) dipetakan otomatis.
  Kamu juga bisa langsung menulis id/label kategori baru (`downloader`, `Gambar & Foto`, ...).
- **Mau memastikan posisinya** — tambahkan slug endpoint ke daftar `SLUGS` di `src/categories.js`.
- **Label yang benar-benar baru** — kategori dibuat otomatis (ikon folder) dan muncul di beranda, dokumentasi, dan sidebar.
- **Mengubah teks/ikon/warna kategori** — edit array `CATEGORIES` di `src/categories.js`.


## Endpoint `rudder-chat` (AI Chat)

`GET /api/rudder-chat?message=Halo` (atau `POST` dengan body JSON `{"message":"Halo"}`). Opsional `sessionId` untuk melanjutkan percakapan.
Atur environment variables berikut di Vercel (Project → Settings → Environment Variables), lalu **redeploy**:

- `RUDDER_USER_ID`: user id akun rudder.chat.
- `RUDDER_COOKIE_C0`: isi cookie `sb-auth-auth-token.0` (export dari browser yang sedang login).
- `RUDDER_COOKIE_C1`: isi cookie `sb-auth-auth-token.1`.
- `RUDDER_TH_WHO`: isi cookie `th_who` (opsional).

Rate limit 10 request/menit per IP. Jika muncul error "cookie/token kedaluwarsa", ambil cookie baru dari browser lalu perbarui env var.
Respons AI bisa memakan waktu >10 detik; jika di Vercel sering timeout, naikkan `maxDuration` fungsi `api/index.js` di `vercel.json`.
