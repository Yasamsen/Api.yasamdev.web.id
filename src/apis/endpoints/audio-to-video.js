export default {
  "slug": "audio-to-video",
  "name": "Audio to Video",
  "description": "Ubah audio (MP3, WAV, dll) menjadi file MP4. Hasil berisi audio saja, tanpa gambar.",
  "category": "Converter",
  "method": "POST",
  "endpoint": "/api/audio-to-video",
  "icon": "Video",
  "parameters": [
    {
      "name": "file",
      "type": "file",
      "required": false,
      "description": "Upload file dari perangkat (maks 4 MB). Format: mp3, wav, ogg, m4a, aac, flac, opus, wma, amr. Kosongkan jika memakai url.",
      "example": "contoh"
    },
    {
      "name": "url",
      "type": "string",
      "required": false,
      "description": "Link langsung ke file publik (http/https). Tanpa batas 4 MB. Alternatif dari upload.",
      "example": "https://example.com/file"
    },
    {
      "name": "filename",
      "type": "string",
      "required": false,
      "description": "Nama file beserta ekstensi. Isi jika url tidak berakhiran ekstensi (mis. video.mp4).",
      "example": "video.mp4"
    }
  ],
  "responseExample": {
    "status": true,
    "source": "FreeConvert",
    "data": {
      "job_id": "example-job-id",
      "type": "Audio to Video",
      "input_filename": "lagu.mp3",
      "output_filename": "lagu.mp4",
      "format": "mp4",
      "file_size_bytes": 1048576,
      "file_size_formatted": "1.00 MB",
      "download_url": "https://cdn.freeconvert.com/example/lagu.mp4",
      "note": "Hasil berupa file MP4 berisi audio (tanpa gambar)."
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
    },
    {
      "name": "data.note",
      "type": "string",
      "description": "Catatan tambahan."
    }
  ],
  "exampleRequest": "GET https://api.yasamdev.web.id/api/audio-to-video?url=https://example.com/lagu.mp3&apikey=KEY_KAMU"
};
