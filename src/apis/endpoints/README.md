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


## Endpoint `music-album`

Tanpa API key dan tanpa environment variable. Hanya satu parameter:

- `GET /api/music-album?artist=Ipank` — semua lagu/karya artis, dicari langsung per lagu (bukan lewat album). Tiap lagu berisi `audio_url` (MP3 penuh, bukan preview 30 detik) dan `download_url` (selalu ada; dibuka -> diarahkan ke MP3 penuh). Tanpa thumbnail.

Daftar lagu dicari berurutan: **Deezer -> iTunes Search API -> pencarian YouTube**, berhenti di sumber pertama yang punya hasil (field `source` menunjukkan sumbernya). Audio penuh dari hasil konversi YouTube (helper yang sama dengan `ytplay`). Konversi dikerjakan paralel selama waktu fungsi cukup (±50 detik, `maxDuration` 60 detik di `vercel.json`). Lagu yang belum sempat diproses berisi `audio_url: null`, tetapi `download_url`-nya tetap berfungsi; memanggil endpoint sekali lagi juga melanjutkan sisanya (hasil dicache ±10 menit). `audio_url` bersifat sementara.

Route lama `music-album-search` dan `music-album-download` diarahkan ke handler ini (`query` = `artist`).


## Endpoint `photoeditor-video` (gambar + prompt -> video)

`GET /api/photoeditor-video?image=URL&prompt=...` — opsional `ratio` (16:9, 9:16, 1:1, 4:3, 3:4), `duration` (2–30 detik, default 5), `resolution` (480p/720p/1080p). Logikanya sama dengan `photoeditor-ai`: unduh gambar -> `create-job` -> polling `get-job`.

Video diproses lebih lama dari foto. Endpoint menunggu ±50 detik; jika belum selesai, responsnya HTTP 202 berisi `data.check_url` (`?job_id=...&serial=...`) yang dipanggil ulang sampai `data.video_url` muncul.

**Wajib dicocokkan sekali:** API video PhotoEditorAI tidak dipublikasikan, jadi URL dan nama field-nya di `PE_VIDEO` (`api/index.js`) adalah tebakan yang meniru API foto. Cara memastikan: buka `photoeditorai.io/ai-video-generator`, DevTools -> Network, klik Generate video, lalu lihat request `create-job` (URL, field form, dan nilai `feature`/`model_name`) dan request `get-job`. Nilai berikut bisa diganti lewat environment variable di Vercel tanpa mengedit kode:

- `PE_VIDEO_CREATE_URL`: URL create-job video.
- `PE_VIDEO_STATUS_URL`: URL get-job; tulis `{id}` dan `{feature}` sebagai placeholder.
- `PE_VIDEO_FEATURE`: nilai `feature`.
- `PE_VIDEO_MODEL`: nilai `model_name`.
- `PE_VIDEO_IMAGE_FIELD`: nama field file gambar.

Nama field lain (`prompt`, `ratio`, `duration`, `resolution`) ada di `PE_VIDEO.fields`. Kredit PhotoEditorAI terpakai per detik video, jadi mulai dengan `duration` kecil saat mencoba.
