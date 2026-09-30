export default {
  slug: "reaction-wa",

  name: "WhatsApp Channel Reaction",

  description:
    "Mengirim reaction emoji ke postingan WhatsApp Channel.",

  category: "WhatsApp",

  method: "GET",

  endpoint: "/api/reaction-wa",

  icon:
    "https://www.google.com/s2/favicons?domain=whatsapp.com&sz=128",

  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description:
        "URL postingan WhatsApp Channel yang ingin diberi reaction.",
      example:
        "https://whatsapp.com/channel/0029Vb8hiKd0gcfQDpEDdf2n/379"
    },

    {
      name: "emojis",
      type: "string",
      required: false,
      description:
        "Emoji reaction, maksimal 4 emoji dan dipisahkan dengan koma.",
      example:
        "😛,😭,😆,🤪"
    },

    {
      name: "count",
      type: "number",
      required: false,
      description:
        "Jumlah reaction yang diminta. Default 1.",
      example: "1"
    }
  ],

  responseExample: {
    status: true,
    source: "Amba Reaction",
    data: {
      success: true
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description:
        "Status request API."
    },

    {
      name: "source",
      type: "string",
      description:
        "Sumber layanan reaction."
    },

    {
      name: "data",
      type: "object",
      description:
        "Response dari server reaction."
    }
  ],

  exampleRequest:
    "/api/reaction-wa?url=https%3A%2F%2Fwhatsapp.com%2Fchannel%2F0029Vb8hiKd0gcfQDpEDdf2n%2F379&emojis=%F0%9F%A4%AA%2C%F0%9F%98%9B%2C%F0%9F%A4%A3%2C%F0%9F%98%82&count=1"
};