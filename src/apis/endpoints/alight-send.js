export default {
  slug: "alight-send",
  name: "AmPrem Create Account",
  description: "Melakukan proses pembuatan akun AmPrem.",
  category: "Tools",
  method: "POST",
  endpoint: "/api/alight/send",
  icon: "UserPlus",

  parameters: [
    {
      name: "email",
      type: "string",
      required: true,
      description: "Email yang digunakan untuk proses pembuatan akun."
    }
  ],

  responseExample: {
    status: true,
    message: "Request berhasil diproses."
  },

  responseFields: [
    {
      name: "status",
      type: "boolean",
      description: "Status request."
    },
    {
      name: "message",
      type: "string",
      description: "Pesan dari API."
    }
  ]
};