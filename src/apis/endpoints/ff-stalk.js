export default {
  slug: "ff-stalk",
  name: "Free Fire Stalk",
  description: "Mengambil metadata akun Free Fire berdasarkan UID.",
  category: "Games",
  method: "GET",
  endpoint: "/api/ff-stalk",
  icon: "Gamepad2",

  parameters: [
    {
      name: "uid",
      type: "string",
      required: true,
      description: "UID akun Free Fire yang ingin dicari.",
      example: "123456789"
    }
  ],

  responseExample: {
    status: true,
    source: "Free Fire",
    data: {
      // Data mengikuti respons asli dari freefire.my.id
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
      description: "Sumber data API."
    },
    {
      name: "data",
      type: "object",
      description: "Metadata akun Free Fire yang dikembalikan oleh sumber API."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/ff-stalk?uid=123456789"
};