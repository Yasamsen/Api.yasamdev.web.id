export default {
  slug: "tempmail",
  name: "Temporary Email",
  description: "Generate email sementara secara acak atau menggunakan custom prefix dan domain.",
  category: "Tools",
  method: "GET",
  endpoint: "/api/tempmail",
  icon: "Mail",

  parameters: [
    {
      name: "action",
      type: "string",
      required: true,
      description: "Mode generate email: random atau custom.",
      example: "random"
    },
    {
      name: "prefix",
      type: "string",
      required: false,
      description: "Prefix email untuk mode custom.",
      example: "testuser"
    },
    {
      name: "domain",
      type: "string",
      required: false,
      description: "Domain email untuk mode custom.",
      example: "georgefletcher.org.uk"
    }
  ],

  responseExample: {
    status: true,
    source: "CleanTempMail",
    action: "random",
    data: {
      email: "random@example.com"
    }
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status request."
    },
    {
      name: "source",
      type: "string",
      description: "Sumber temporary email."
    },
    {
      name: "action",
      type: "string",
      description: "Mode yang digunakan."
    },
    {
      name: "data",
      type: "object",
      description: "Data email yang dibuat."
    }
  ]
};