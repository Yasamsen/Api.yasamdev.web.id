export default {
  "slug": "svg-to-xml",
  "cost": 1,
  "name": "SVG to XML (Alight Motion)",
  "description": "Ubah SVG menjadi file XML shape vektor yang bisa diimpor ke Alight Motion. Bentuk, warna, dan kurva dibawa; lubang dibuang karena Alight Motion tidak menampilkannya.",
  "category": "Converter",
  "method": "POST",
  "endpoint": "/api/svg-to-xml",
  "icon": "FileCode",
  "parameters": [
    {
      "name": "file",
      "type": "file",
      "required": false,
      "description": "Berkas .svg (maksimal 4 MB). Kosongkan jika memakai field svg.",
      "example": "logo.svg"
    },
    {
      "name": "svg",
      "type": "string",
      "required": false,
      "description": "Kode SVG langsung (alternatif dari upload file).",
      "example": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"#e63946\"/></svg>"
    },
    {
      "name": "width",
      "type": "number",
      "required": false,
      "description": "Lebar proyek Alight Motion (piksel), 16 sampai 8192. Default 1080.",
      "example": 1080
    },
    {
      "name": "height",
      "type": "number",
      "required": false,
      "description": "Tinggi proyek Alight Motion (piksel), 16 sampai 8192. Default 1920.",
      "example": 1920
    },
    {
      "name": "scale",
      "type": "number",
      "required": false,
      "description": "Skala gambar di dalam kanvas, 0.05 sampai 1. Default 0.9 (ada tepi kosong).",
      "example": 0.9
    },
    {
      "name": "fps",
      "type": "number",
      "required": false,
      "description": "Frame per detik, 1 sampai 240. Default 60.",
      "example": 60
    },
    {
      "name": "duration",
      "type": "number",
      "required": false,
      "description": "Durasi proyek dalam milidetik, 100 sampai 600000. Default 5000.",
      "example": 5000
    },
    {
      "name": "bgcolor",
      "type": "string",
      "required": false,
      "description": "Warna latar proyek berformat #AARRGGBB. Default #ff000000 (hitam).",
      "example": "#ff000000"
    },
    {
      "name": "order",
      "type": "select",
      "required": false,
      "description": "Urutan tumpukan shape. Otomatis: hasil dari Image to SVG memakai urut luas, SVG desain memakai urutan dokumen.",
      "options": [
        {
          "value": "auto",
          "label": "Otomatis"
        },
        {
          "value": "document",
          "label": "Urutan dokumen SVG"
        },
        {
          "value": "area",
          "label": "Urut luas (hasil tracing)"
        }
      ],
      "example": "auto"
    },
    {
      "name": "max_shapes",
      "type": "number",
      "required": false,
      "description": "Batas jumlah shape, 1 sampai 3000. Shape terkecil dibuang jika melebihi. Default 500.",
      "example": 500
    },
    {
      "name": "output",
      "type": "select",
      "required": false,
      "description": "file: berkas XML (default). json: respons JSON berisi XML, peringatan, dan statistik.",
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
      "filename": "logo.xml",
      "shapes": 17,
      "width": 1080,
      "height": 1920,
      "order": "area",
      "dropped": {
        "holes": 4,
        "tiny": 0,
        "limit": 0
      },
      "warnings": [
        "4 lubang dibuang: Alight Motion tidak menampilkan lubang pada shape. Bentuk di dalam lubang yang digambar di atasnya tetap tampil."
      ],
      "xml": "<?xml version='1.0' encoding='UTF-8' ?>\n<scene title=\"logo\" width=\"1080\" height=\"1920\" ...>...</scene>"
    }
  },
  "responseFields": [
    {
      "name": "(output=file)",
      "type": "application/xml",
      "description": "Berkas XML langsung. Jumlah shape ada di header X-Shapes, peringatan di X-Warnings (URL-encoded)."
    },
    {
      "name": "status",
      "type": "boolean",
      "description": "true jika berhasil (output=json)."
    },
    {
      "name": "data.filename",
      "type": "string",
      "description": "Nama berkas yang disarankan."
    },
    {
      "name": "data.shapes",
      "type": "number",
      "description": "Jumlah shape di XML."
    },
    {
      "name": "data.width",
      "type": "number",
      "description": "Lebar proyek."
    },
    {
      "name": "data.height",
      "type": "number",
      "description": "Tinggi proyek."
    },
    {
      "name": "data.order",
      "type": "string",
      "description": "Urutan tumpukan yang dipakai: document atau area."
    },
    {
      "name": "data.dropped",
      "type": "object",
      "description": "Jumlah potongan yang dibuang: holes (lubang), tiny (terlalu kecil), limit (melebihi max_shapes)."
    },
    {
      "name": "data.warnings",
      "type": "array",
      "description": "Hal yang tidak bisa dibawa persis ke Alight Motion."
    },
    {
      "name": "data.xml",
      "type": "string",
      "description": "Kode XML lengkap."
    }
  ],
  "exampleRequest": "POST https://api.yasamdev.web.id/api/svg-to-xml (multipart/form-data, field \"file\" atau \"svg\")"
};
