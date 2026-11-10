# Login Google, API key per user, dan kuota

## Environment variable (Vercel → Settings → Environment Variables)
| Nama | Wajib | Keterangan |
|---|---|---|
| `GOOGLE_CLIENT_ID` | ya | OAuth Client ID tipe **Web application** (Google Cloud Console → APIs & Services → Credentials). |
| `URLDATABASE` | ya | Connection string MongoDB (sudah dipakai fitur lain). |
| `USER_SECRET` | tidak | Kunci penandatangan sesi user. Kosong = memakai `ADMIN_SECRET` / `ADMIN_PASSWORD`. |
| `USER_DAILY_LIMIT` | tidak | Kuota request per user per hari. Default `100`. |
| `REQUIRE_LOGIN` | tidak | Isi `0` untuk mematikan gerbang login sementara. |

Di Google Cloud Console, pada OAuth Client tambahkan **Authorized JavaScript origins**:
`https://api.yasamdev.web.id` (dan `http://localhost:5173` untuk lokal). Redirect URI tidak diperlukan.

Selama `GOOGLE_CLIENT_ID` atau `URLDATABASE` belum diisi, gerbang login otomatis nonaktif (endpoint tetap terbuka seperti sebelumnya).

## Cara akses endpoint
- **Website**: login Google, lalu "Send request" di dokumentasi (header `x-user-token` dikirim otomatis).
- **Bot / script**: `https://domain/api/<endpoint>?...&apikey=sam_xxx` atau header `x-api-key: sam_xxx`.
- Kuota reset tiap tengah malam WIB. Habis -> HTTP 429.
- Admin (`/admin`) dan key buatan admin yang lama tetap bisa mengakses tanpa kuota user.
- Tab **Pengguna** di `/admin`: atur limit khusus per user dan blokir akun.
