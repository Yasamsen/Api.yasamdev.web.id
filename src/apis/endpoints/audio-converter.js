export default {
  "slug": "audio-converter",
  "name": "Audio Converter",
  "description": "Konversi antar format audio: MP3, WAV, OGG, M4A, AAC, FLAC.",
  "category": "Converter",
  "method": "POST",
  "endpoint": "/api/audio-converter",
  "icon": "AudioLines",
  "parameters": [
    {
      "name": "file",
      "type": "file",
      "required": true,
      "description": "Pilih file dari perangkat. Maksimal 4 MB. Format: mp3, wav, ogg, m4a, aac, flac, opus, wma, amr.",
      "example": "contoh"
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
      "type": "Audio Converter",
      "input_filename": "lagu.wav",
      "output_filename": "lagu.mp3",
      "format": "mp3",
      "bitrate": "192k",
      "file_size_bytes": 1048576,
      "file_size_formatted": "1.00 MB",
      "download_url": "https://cdn.freeconvert.com/example/lagu.mp3"
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
  "exampleRequest": "POST https://api.yasamdev.web.id/api/audio-converter (multipart/form-data, field \"file\")"
};
