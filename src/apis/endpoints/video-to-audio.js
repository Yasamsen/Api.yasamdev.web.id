export default {
  "slug": "video-to-audio",
  "name": "Video to Audio",
  "description": "Ambil audio dari video dan simpan sebagai MP3, WAV, OGG, M4A, AAC, atau FLAC.",
  "category": "Converter",
  "method": "POST",
  "endpoint": "/api/video-to-audio",
  "icon": "FileAudio",
  "parameters": [
    {
      "name": "file",
      "type": "file",
      "required": false,
      "description": "Upload file dari perangkat (maks 4 MB). Format: mp4, mov, webm, mkv, avi, m4v, flv, wmv, 3gp, mpg. Kosongkan jika memakai url.",
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
    },
    {
      "name": "format",
      "type": "select",
      "required": false,
      "description": "Format audio hasil. Default mp3.",
      "options": [
        {
          "value": "mp3",
          "label": "MP3"
        },
        {
          "value": "wav",
          "label": "WAV"
        },
        {
          "value": "ogg",
          "label": "OGG"
        },
        {
          "value": "m4a",
          "label": "M4A"
        },
        {
          "value": "aac",
          "label": "AAC"
        },
        {
          "value": "flac",
          "label": "FLAC"
        }
      ],
      "example": "mp3"
    },
    {
      "name": "bitrate",
      "type": "select",
      "required": false,
      "description": "Bitrate audio (hanya untuk mp3, ogg, m4a, aac).",
      "options": [
        {
          "value": "64k",
          "label": "64 kbps"
        },
        {
          "value": "128k",
          "label": "128 kbps"
        },
        {
          "value": "192k",
          "label": "192 kbps"
        },
        {
          "value": "256k",
          "label": "256 kbps"
        },
        {
          "value": "320k",
          "label": "320 kbps"
        }
      ],
      "example": "192k"
    }
  ],
  "responseExample": {
    "status": true,
    "source": "FreeConvert",
    "data": {
      "job_id": "example-job-id",
      "type": "Video to Audio",
      "input_filename": "video.mp4",
      "output_filename": "video.mp3",
      "format": "mp3",
      "bitrate": "192k",
      "file_size_bytes": 1048576,
      "file_size_formatted": "1.00 MB",
      "download_url": "https://cdn.freeconvert.com/example/video.mp3"
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
      "name": "data.bitrate",
      "type": "string",
      "description": "Bitrate audio hasil."
    }
  ],
  "exampleRequest": "GET https://api.yasamdev.web.id/api/video-to-audio?url=https://example.com/video.mp4&apikey=KEY_KAMU"
};
