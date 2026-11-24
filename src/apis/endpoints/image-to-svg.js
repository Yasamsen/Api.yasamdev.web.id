export default {
  "slug": "image-to-svg",
  "name": "Image to SVG (Vectorizer)",
  "description": "Ubah foto atau logo (PNG, JPG, WebP) menjadi SVG vektor yang bisa diedit di Illustrator, Inkscape, Figma, atau diimpor ke Alight Motion lewat SVG to XML.",
  "category": "Converter",
  "method": "POST",
  "endpoint": "/api/image-to-svg",
  "icon": "Spline",
  "parameters": [
    {
      "name": "file",
      "type": "file",
      "required": true,
      "description": "Gambar PNG, JPG, atau WebP. Maksimal 4 MB.",
      "example": "logo.png"
    },
    {
      "name": "colors",
      "type": "number",
      "required": false,
      "description": "Jumlah warna, 2 sampai 32. Logo sederhana: 2-8. Foto: 12-32. Default 12.",
      "example": 12
    },
    {
      "name": "detail",
      "type": "select",
      "required": false,
      "description": "Tingkat detail kontur. Default medium.",
      "options": [
        {
          "value": "low",
          "label": "Rendah (lebih sedikit titik)"
        },
        {
          "value": "medium",
          "label": "Sedang"
        },
        {
          "value": "high",
          "label": "Tinggi (lebih detail)"
        }
      ],
      "example": "medium"
    },
    {
      "name": "size",
      "type": "number",
      "required": false,
      "description": "Sisi terpanjang hasil dalam piksel, 100 sampai 1200. Default 640.",
      "example": 640
    },
    {
      "name": "remove_background",
      "type": "select",
      "required": false,
      "description": "Buang warna latar (warna terbanyak di tepi gambar). Cocok untuk logo berlatar polos.",
      "options": [
        {
          "value": "false",
          "label": "Tidak"
        },
        {
          "value": "true",
          "label": "Ya, buang latar"
        }
      ],
      "example": "false"
    },
    {
      "name": "output",
      "type": "select",
      "required": false,
      "description": "file: langsung berkas SVG (default). json: respons JSON berisi kode SVG.",
      "options": [
        {
          "value": "file",
          "label": "File (SVG/XML langsung)"
        },
        {
          "value": "json",
          "label": "JSON (berisi kode di dalam)"
        }
      ],
      "example": "file"
    }
  ],
  "responseExample": {
    "status": true,
    "data": {
      "width": 640,
      "height": 480,
      "colors": 6,
      "paths": 25,
      "has_transparency": false,
      "size_bytes": 9421,
      "filename": "logo.svg",
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" ...>...</svg>"
    }
  },
  "responseFields": [
    {
      "name": "(output=file)",
      "type": "image/svg+xml",
      "description": "Berkas SVG langsung. Ukuran dan jumlah path ada di header X-Vector-Width, X-Vector-Height, X-Vector-Colors, X-Vector-Paths."
    },
    {
      "name": "status",
      "type": "boolean",
      "description": "true jika berhasil (output=json)."
    },
    {
      "name": "data.width",
      "type": "number",
      "description": "Lebar SVG (piksel)."
    },
    {
      "name": "data.height",
      "type": "number",
      "description": "Tinggi SVG (piksel)."
    },
    {
      "name": "data.colors",
      "type": "number",
      "description": "Jumlah warna yang dipakai."
    },
    {
      "name": "data.paths",
      "type": "number",
      "description": "Jumlah bentuk (path) hasil pelacakan."
    },
    {
      "name": "data.has_transparency",
      "type": "boolean",
      "description": "true jika gambar punya area transparan."
    },
    {
      "name": "data.size_bytes",
      "type": "number",
      "description": "Ukuran kode SVG dalam byte."
    },
    {
      "name": "data.filename",
      "type": "string",
      "description": "Nama berkas yang disarankan."
    },
    {
      "name": "data.svg",
      "type": "string",
      "description": "Kode SVG lengkap."
    }
  ],
  "exampleRequest": "POST https://api.yasamdev.web.id/api/image-to-svg (multipart/form-data, field \"file\")"
};
