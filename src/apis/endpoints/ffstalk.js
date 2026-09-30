export default {
  slug: "ffstalk",
  name: "Free Fire Stalk",
  description: "Mendapatkan nickname akun Free Fire berdasarkan User ID.",
  category: "Stalker",
  method: "GET",
  endpoint: "/api/ffstalk",
  icon: "Gamepad2",
  parameters: [
    {
      name: "userId",
      type: "string",
      required: true,
      description: "User ID akun Free Fire.",
      example: "123456789"
    }
  ],
  responseExample: {
    status: true,
    source: "Codashop",
    data: {
      id: "123456789",
      nickname: "NamaPlayer"
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
      description: "Sumber data nickname."
    },
    {
      name: "data.id",
      type: "string",
      description: "User ID Free Fire."
    },
    {
      name: "data.nickname",
      type: "string",
      description: "Nickname akun Free Fire."
    }
  ],
  exampleRequest: "https://samapi.example.com/api/ffstalk?userId=123456789"
};