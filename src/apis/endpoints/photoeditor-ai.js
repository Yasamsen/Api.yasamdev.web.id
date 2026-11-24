export default {
  slug: "photoeditor-ai",

  name: "PhotoEditor AI",

  description:
    "Mengedit gambar menggunakan AI PhotoEditorAI berdasarkan prompt, model, dan aspect ratio.",

  category: "AI",

  method: "GET",

  endpoint:
    "/api/photoeditor-ai",

  icon:
    "ImagePlus",

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
    },

    {
      name: "model",

      type: "select",

      required: false,

      description:
        "Model AI yang digunakan.",

      options: [

        {
          label:
            "PhotoEditor 4.0",

          value:
            "photoeditor_4.0"
        }

      ],

      example:
        "photoeditor_4.0"
    }

  ],


  responseExample: {

    status: true,

    source:
      "PhotoEditorAI",

    data: {

      code:
        100000,

      result: {

        status:
          2

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
        "Data hasil proses dari PhotoEditorAI."
    }

  ],


  exampleRequest:
    "https://samapi.example.com/api/photoeditor-ai?image=https://example.com/image.jpg&prompt=Tambahkan%20kacamata%20stylish&ratio=9:16&model=photoeditor_4.0"

};