# Image to SVG & SVG to XML (Alight Motion)

## POST /api/image-to-svg 
Foto/logo -> SVG vektor yang bisa diedit. Dikerjakan di server sendiri (sharp + pelacak kontur), tanpa layanan pihak ketiga.

    curl -X POST https://DOMAIN/api/image-to-svg -H "x-api-key: KEY" \
      -F "file=@logo.png" -F "colors=8" -F "detail=medium" -o logo.svg

Parameter: `file` (PNG/JPG/WebP, maks 4 MB), `colors` 2-32 (default 12), `detail` low|medium|high,
`size` 100-1200 (default 640), `remove_background` true|false, `output` file|json.
Tips: logo/ikon 2-8 warna; foto 12-32 warna. Hasil foto berupa area warna bertingkat (posterize), bukan foto mulus.

## POST /api/svg-to-xml 
SVG -> XML shape untuk Alight Motion.

    curl -X POST https://DOMAIN/api/svg-to-xml -H "x-api-key: KEY" -F "file=@logo.svg" -o logo.xml

Parameter: `file` (.svg) atau `svg` (kode), `width`/`height` (default 1080x1920), `scale` (0.9), `fps` (60),
`duration` ms (5000), `bgcolor` #AARRGGBB (#ff000000), `order` auto|document|area, `max_shapes` (500), `output` file|json.

Alur lengkap: foto -> `image-to-svg` (output=file) -> `svg-to-xml` -> impor XML di Alight Motion.
SVG hasil `image-to-svg` ditandai `data-order="area"` sehingga otomatis ditumpuk berdasarkan luas.

## Batasan (penting)
- Alight Motion tidak menampilkan lubang pada shape. Tiap potongan dijadikan shape sendiri (besar di bawah,
  kecil di atas) dan lubang dibuang; bentuk lain yang digambar di atas lubang tetap tampil. Lubang yang isinya
  transparan (mis. donat) akan terisi. Daftar peringatan ada di header `X-Warnings` / `data.warnings`.
- Gradient diganti warna pertamanya. Lebar garis tepi (stroke) belum dibawa. Teks, gambar, clipPath/mask dilewati.
- Format XML disusun dari struktur ekspor Alight Motion 5.x yang terdokumentasi publik. Belum diuji langsung di
  aplikasinya: kalau impor gagal, coba ubah `amver`/`ffver` di kode, atau kirim satu XML hasil ekspor Alight Motion
  agar bisa disamakan persis.
