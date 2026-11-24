export default {
  "slug": "to-gif",
  "name": "Video to GIF",
  "description": "Ubah video (MP4, MOV, WEBM, AVI, dll) menjadi GIF animasi.",
  "category": "Converter",
  "method": "POST",
  "endpoint": "/api/to-gif",
  "icon": "Film",
  "parameters": [
    {
      "name": "file",
      "type": "file",
      "required": true,
      "description": "Pilih file dari perangkat. Maksimal 4 MB. Format: mp4, mov, webm, mkv, avi, m4v, flv, wmv, 3gp, mpg.",
      "example": "contoh"
    }
  ],
  "responseExample": {
    "status": true,
    "source": "FreeConvert",
    "data": {
      "job_id": "example-job-id",
      "type": "Video to GIF",
      "input_filename": "clip.mp4",
      "output_filename": "clip.gif",
      "format": "gif",
      "file_size_bytes": 1048576,
      "file_size_formatted": "1.00 MB",
      "download_url": "https://cdn.freeconvert.com/example/clip.gif"
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
  "exampleRequest": "POST https://api.yasamdev.web.id/api/to-gif (multipart/form-data, field \"file\")"
};
