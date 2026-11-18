export default {
  slug: "motionbgs",
  name: "MotionBGs Live Wallpaper",
  description:
    "Mengambil detail live wallpaper dari motionbgs.com: judul, thumbnail, video preview, tag, link download 4K/HD, dan wallpaper terkait.",
  category: "Downloader",
  method: "GET",
  endpoint: "/api/motionbgs",
  icon: "MonitorPlay",
  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "URL halaman wallpaper di motionbgs.com (slug saja juga diterima)",
      example: "https://motionbgs.com/celestial-veil"
    }
  ],
  responseExample: {
    status: true,
    source: "MotionBGs",
    data: {
      id: "8626",
      slug: "celestial-veil",
      title: "Celestial Veil Live Wallpaper",
      description: "4K Celestial Veil Live Wallpaper ✓ Set a Anime (Anime Girl) Inspired Animated Wallpaper",
      url: "https://motionbgs.com/celestial-veil",
      thumbnail: "https://motionbgs.com/media/8626/celestial-veil.3840x2160.jpg",
      previewVideo: "https://motionbgs.com/media/8626/celestial-veil.960x540.mp4",
      tags: [
        {
          name: "Dark",
          url: "https://motionbgs.com/tag:dark/",
          thumbnail: "https://motionbgs.com/i/c/48x48/media/1962/straw-hat-luffy.jpg"
        },
        {
          name: "Fantasy",
          url: "https://motionbgs.com/tag:fantasy/",
          thumbnail: "https://motionbgs.com/i/c/48x48/media/8818/crown-of-midnight.3840x2160.jpg"
        },
        {
          name: "Anime Girl",
          url: "https://motionbgs.com/tag:girl/",
          thumbnail: "https://motionbgs.com/i/c/48x48/media/8626/celestial-veil.3840x2160.jpg"
        }
      ],
      downloads: [
        {
          quality: "4K",
          resolution: "3840x2160",
          size: "15.8Mb",
          format: "mp4",
          url: "https://motionbgs.com/dl/4k/8626"
        },
        {
          quality: "HD",
          resolution: "1920x1080",
          size: "1.9Mb",
          format: "mp4",
          url: "https://motionbgs.com/dl/hd/8626"
        }
      ],
      related: [
        {
          title: "Serious Girl",
          slug: "serious-girl",
          url: "https://motionbgs.com/serious-girl",
          thumbnail: "https://motionbgs.com/i/c/..."
        }
      ]
    }
  },
  responseFields: [
    { name: "status", type: "boolean", description: "Status keberhasilan request" },
    { name: "source", type: "string", description: "Sumber data (MotionBGs)" },
    { name: "data.id", type: "string", description: "ID wallpaper dari link download" },
    { name: "data.slug", type: "string", description: "Slug halaman wallpaper" },
    { name: "data.title", type: "string", description: "Judul wallpaper" },
    { name: "data.description", type: "string", description: "Deskripsi dari meta halaman" },
    { name: "data.url", type: "string", description: "URL halaman asli" },
    { name: "data.thumbnail", type: "string", description: "URL gambar thumbnail 4K" },
    { name: "data.previewVideo", type: "string", description: "URL video preview (960x540)" },
    { name: "data.tags", type: "array", description: "Daftar tag/kategori beserta thumbnail" },
    { name: "data.downloads", type: "array", description: "Link download per kualitas (quality, resolution, size, format, url)" },
    { name: "data.related", type: "array", description: "Daftar wallpaper terkait (title, slug, url, thumbnail)" }
  ],
  exampleRequest: "https://samapi.example.com/api/motionbgs?url=https://motionbgs.com/celestial-veil"
};