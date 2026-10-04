export default {
  slug: "unwatermark-nano-banana",

  name: "Unwatermark Nano Banana",

  description:
    "Mengedit gambar menggunakan AI Nano Banana dari Unwatermark AI berdasarkan prompt dan aspect ratio.",

  category: "Tools",

  method: "GET",

  endpoint:
    "/api/unwatermark-nano-banana",

  icon:
    "WandSparkles",

  parameters: [
    {
      name: "image",

      type: "string",

      required: true,

      description:
        "URL gambar yang ingin diedit.",

      example:
        "https://example.com/image.jpg"
    },

    {
      name: "prompt",

      type: "string",

      required: true,

      description:
        "Instruksi AI untuk mengedit gambar.",

      example:
        "Tambahkan kacamata stylish pada karakter"
    },

    {
      name: "ratio",

      type: "select",

      required: false,

      description:
        "Aspect ratio hasil gambar.",

      options: [
        {
          label:
            "Match Input Image",

          value:
            "match_input_image"
        },

        {
          label:
            "1:1",

          value:
            "1:1"
        },

        {
          label:
            "4:3",

          value:
            "4:3"
        },

        {
          label:
            "3:4",

          value:
            "3:4"
        },

        {
          label:
            "16:9",

          value:
            "16:9"
        },

        {
          label:
            "9:16",

          value:
            "9:16"
        },

        {
          label:
            "3:2",

          value:
            "3:2"
        },

        {
          label:
            "2:3",

          value:
            "2:3"
        }
      ],

      example:
        "9:16"
    }
  ],

  responseExample: {
    status: true,

    source:
      "Unwatermark Nano Banana",

    data: {
      result: {
        status: 1
      }
    }
  },

  responseFields: [
    {
      name:
        "status",

      type:
        "boolean",

      description:
        "Menunjukkan apakah request berhasil."
    },

    {
      name:
        "source",

      type:
        "string",

      description:
        "Nama sumber layanan AI."
    },

    {
      name:
        "data",

      type:
        "object",

      description:
        "Data hasil editing dari Unwatermark AI."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/unwatermark-nano-banana?image=https://example.com/image.jpg&prompt=Tambahkan%20kacamata%20stylish&ratio=9:16"
};