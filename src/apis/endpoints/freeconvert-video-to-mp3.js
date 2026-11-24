export default {
  slug: "freeconvert-video-to-mp3",
  name: "Video to MP3",
  description: "Unggah video dari perangkat seperti ToURL, lalu konversi menjadi audio MP3.",
  category: "Converter",
  method: "POST",
  endpoint: "/api/freeconvert-video-to-mp3",
  icon: "FileAudio",
  parameters: [
    {
      name: "file",
      type: "file",
      required: true,
      description: "Pilih file video dari perangkat. Maksimal 4 MB.",
      example: "video.mp4"
    },
    {
      name: "bitrate",
      type: "select",
      required: false,
      description: "Bitrate audio hasil konversi.",
      options: [
        { value: "128k", label: "128 kbps" },
        { value: "192k", label: "192 kbps" },
        { value: "256k", label: "256 kbps" },
        { value: "320k", label: "320 kbps" }
      ],
      example: "192k"
    }
  ],
  responseExample: {
    status: true,
    source: "FreeConvert",
    data: {
      job_id: "example-job-id",
      input_filename: "video.mp4",
      output_filename: "video.mp3",
      format: "mp3",
      bitrate: "192k",
      file_size_bytes: 1048576,
      file_size_formatted: "1.00 MB",
      download_url: "https://example.com/video.mp3"
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "Status keberhasilan permintaan." },
    { name: "source", type: "string", description: "Layanan konversi yang digunakan." },
    { name: "data.job_id", type: "string", description: "ID job konversi." },
    { name: "data.input_filename", type: "string", description: "Nama file video yang diunggah." },
    { name: "data.output_filename", type: "string", description: "Nama file MP3 hasil." },
    { name: "data.format", type: "string", description: "Format audio keluaran." },
    { name: "data.bitrate", type: "string", description: "Bitrate audio." },
    { name: "data.file_size_bytes", type: "number", description: "Ukuran hasil dalam byte." },
    { name: "data.file_size_formatted", type: "string", description: "Ukuran hasil yang diformat." },
    { name: "data.download_url", type: "string", description: "URL unduhan MP3." }
  ],
  exampleRequest: "POST https://samapi.example.com/api/freeconvert-video-to-mp3 (multipart/form-data)"
};
