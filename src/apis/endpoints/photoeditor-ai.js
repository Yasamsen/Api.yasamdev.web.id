export default {
  slug: "photoeditor-ai",
  name: "PhotoEditor AI",
  description: "Mengedit gambar menggunakan AI PhotoEditorAI berdasarkan prompt.",
  category: "AI",
  method: "GET",
  endpoint: "/api/photoeditor-ai",
  icon: "ImagePlus",

  parameters: [
    {
      name: "image",
      type: "string",
      required: true,
      description: "URL gambar yang ingin diedit.",
      example: "https://example.com/image.jpg"
    },
    {
      name: "prompt",
      type: "string",
      required: true,
      description: "Instruksi atau prompt untuk mengedit gambar.",
      example: "Tambahkan kacamata stylish pada karakter"
    }
  ],

  responseExample: {
    status: true,
    source: "PhotoEditorAI",
    data: {
      code: 100000,
      result: {
        status: 2
      }
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Menunjukkan apakah request berhasil."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber layanan AI yang digunakan."
    },
    {
      name: "data",
      type: "object",
      description: "Data hasil proses dari PhotoEditorAI."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/photoeditor-ai?image=https://example.com/image.jpg&prompt=Tambahkan%20kacamata%20stylish"
};