export default {
  slug: "unblur-img",

  name: "Unblur Image",

  description:
    "Menghilangkan blur dan meningkatkan kualitas gambar menggunakan UnblurImg AI.",

  category: "Tools",

  method: "GET",

  endpoint:
    "/api/unblur-img",

  icon:
    "Sparkles",

  parameters: [
    {
      name: "image",

      type: "string",

      required: true,

      description:
        "URL gambar yang ingin di-unblur dan ditingkatkan kualitasnya.",

      example:
        "https://example.com/image.jpg"
    }
  ],

  responseExample: {
    status: true,

    source:
      "UnblurImg",

    data: {
      original:
        "https://example.com/original.jpg",

      result:
        "https://unblurimg.ai/generated/result.jpg"
    }
  },

  responseFields: [
    {
      name: "status",

      type: "boolean",

      description:
        "Menunjukkan apakah request berhasil."
    },

    {
      name: "source",

      type: "string",

      description:
        "Nama sumber layanan yang digunakan."
    },

    {
      name: "data",

      type: "object",

      description:
        "Data hasil proses unblur gambar."
    },

    {
      name: "data.original",

      type: "string",

      description:
        "URL gambar asli yang diproses."
    },

    {
      name: "data.result",

      type: "string",

      description:
        "URL gambar hasil unblur dan enhance."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/unblur-img?image=https://example.com/image.jpg"
};