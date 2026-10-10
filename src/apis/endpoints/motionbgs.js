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
      description: "Slug atau URL halaman wallpaper di motionbgs.com",
      example: "nelliel"
    }
  ],
  responseExample: {
    status: true,
    source: "MotionBGs",
    data: {
      id: "10273",
      slug: "nelliel",
      title: "Nelliel Hollow Beauty Live Wallpaper",
      description: "4K Nelliel Hollow Beauty Live Wallpaper ✓ Set a Anime (Bleach) Inspired Animated Wallpaper",
      url: "https://motionbgs.com/nelliel",
      thumbnail: "https://motionbgs.com/media/10273/nelliel.3840x2160.jpg",
      previewVideo: "https://motionbgs.com/media/10273/nelliel.960x540.mp4",
      tags: [
        {
          name: "Bleach",
          url: "https://motionbgs.com/tag:bleach/",
          thumbnail: "https://motionbgs.com/i/c/48x48/media/2706/sosuke-aizen-bleach.jpg"
        }
      ],
      downloads: [
        {
          quality: "4K",
          resolution: "3840x2160",
          size: "36.5Mb",
          format: "mp4",
          url: "https://motionbgs.com/dl/4k/10273"
        },
        {
          quality: "HD",
          resolution: "1920x1080",
          size: "18.3Mb",
          format: "mp4",
          url: "https://motionbgs.com/dl/hd/10273"
        }
      ],
      related: [
        {
          title: "Makima Waifu",
          slug: "makima-waifu",
          url: "https://motionbgs.com/makima-waifu",
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
  exampleRequest: "https://samapi.example.com/api/motionbgs?url=nelliel"
};