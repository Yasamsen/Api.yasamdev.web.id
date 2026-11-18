export default {
  slug: "ai-image",
  name: "AI Image",
  description: "Generate gambar AI berdasarkan prompt dan negative prompt.",
  category: "AI",
  method: "GET",
  endpoint: "/api/ai-image",

  icon: "https://www.google.com/s2/favicons?domain=live3d.io&sz=128",

  parameters: [
    {
      name: "prompt",
      type: "string",
      required: true,
      description: "Prompt atau deskripsi gambar yang ingin dibuat.",
      example: "anime girl with blue hair"
    },
    {
      name: "negative_prompt",
      type: "string",
      required: false,
      description: "Negative prompt untuk menentukan hal yang ingin dihindari.",
      example: "bad quality, blurry, deformed"
    },
    {
      name: "model",
      type: "string",
      required: false,
      description: "Model AI yang digunakan untuk generate gambar.",
      example: "AbsoluteReality_v1.8.1.safetensors"
    },
    {
      name: "cfg",
      type: "number",
      required: false,
      description: "Nilai CFG untuk proses generate gambar.",
      example: 7
    }
  ],

  responseExample: {
    status: true,
    creator: "t.me/IkyyExecutive",
    runtime: "15234 ms",

    result: {
      task_id: "example-task-id",
      prompt: "anime girl with blue hair",
      negative_prompt: "bad quality, blurry, deformed",
      model: "AbsoluteReality_v1.8.1.safetensors",
      cfg: 7,
      result_image_url: "https://temp.live3d.io/example.jpg"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status request."
    },
    {
      name: "creator",
      type: "string",
      description: "Creator scraper."
    },
    {
      name: "runtime",
      type: "string",
      description: "Waktu proses generate."
    },
    {
      name: "result",
      type: "object",
      description: "Data hasil generate gambar."
    },
    {
      name: "result.task_id",
      type: "string",
      description: "ID task dari server AI."
    },
    {
      name: "result.prompt",
      type: "string",
      description: "Prompt yang digunakan."
    },
    {
      name: "result.negative_prompt",
      type: "string",
      description: "Negative prompt yang digunakan."
    },
    {
      name: "result.model",
      type: "string",
      description: "Model AI yang digunakan."
    },
    {
      name: "result.cfg",
      type: "number",
      description: "Nilai CFG yang digunakan."
    },
    {
      name: "result.result_image_url",
      type: "string",
      description: "URL gambar hasil generate."
    }
  ],

  exampleRequest:
    "/api/ai-image?prompt=anime%20girl%20with%20blue%20hair&negative_prompt=bad%20quality%2C%20blurry&model=AbsoluteReality_v1.8.1.safetensors&cfg=7"
};