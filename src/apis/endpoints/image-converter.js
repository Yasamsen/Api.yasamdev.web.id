export default {
  "slug": "image-converter",
  "name": "Image Converter",
  "description": "Konversi gambar antar format: HEIC, WEBP, JFIF, JPG, PNG, GIF, BMP, TIFF.",
  "category": "Converter",
  "method": "POST",
  "endpoint": "/api/image-converter",
  "icon": "Images",
  "parameters": [
    {
      "name": "file",
      "type": "file",
      "required": true,
      "description": "Pilih file dari perangkat. Maksimal 4 MB. Format: jpg, png, webp, heic, jfif, bmp, tiff, gif, avif.",
      "example": "contoh"
    },
    {
      "name": "format",
      "type": "select",
      "required": false,
      "description": "Format gambar hasil. Default png.",
      "options": [
        {
          "value": "jpg",
          "label": "JPG"
        },
        {
          "value": "png",
          "label": "PNG"
        },
        {
          "value": "webp",
          "label": "WEBP"
        },
        {
          "value": "gif",
          "label": "GIF"
        },
        {
          "value": "bmp",
          "label": "BMP"
        },
        {
          "value": "tiff",
          "label": "TIFF"
        }
      ],
      "example": "png"
    }
  ],
  "responseExample": {
    "status": true,
    "source": "FreeConvert",
    "data": {
      "job_id": "example-job-id",
      "type": "Image Converter",
      "input_filename": "foto.heic",
      "output_filename": "foto.png",
      "format": "png",
      "file_size_bytes": 1048576,
      "file_size_formatted": "1.00 MB",
      "download_url": "https://cdn.freeconvert.com/example/foto.png"
    }
  },
  "responseFields": [
    {
      "name": "status",
      "type": "boolean",
      "description": "true jika konversi berhasil."
    },
    {
      "name": "source",
      "type": "string",
      "description": "Penyedia konversi (FreeConvert)."
    },
    {
      "name": "data.job_id",
      "type": "string",
      "description": "ID job konversi."
    },
    {
      "name": "data.type",
      "type": "string",
      "description": "Jenis konversi."
    },
    {
      "name": "data.input_filename",
      "type": "string",
      "description": "Nama file asal."
    },
    {
      "name": "data.output_filename",
      "type": "string",
      "description": "Nama file hasil."
    },
    {
      "name": "data.format",
      "type": "string",
      "description": "Format hasil."
    },
    {
      "name": "data.file_size_bytes",
      "type": "number",
      "description": "Ukuran hasil dalam byte."
    },
    {
      "name": "data.file_size_formatted",
      "type": "string",
      "description": "Ukuran hasil yang mudah dibaca."
    },
    {
      "name": "data.download_url",
      "type": "string",
      "description": "Link unduh hasil (kedaluwarsa dalam beberapa jam)."
    }
  ],
  "exampleRequest": "POST https://api.yasamdev.web.id/api/image-converter (multipart/form-data, field \"file\")"
};
