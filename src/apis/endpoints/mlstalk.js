export default {
  slug: "mlstalk",
  name: "Mobile Legends Stalk",
  description: "Mengecek informasi akun Mobile Legends berdasarkan User ID dan Zone ID.",
  category: "Stalker",
  method: "GET",
  endpoint: "/api/mlstalk",
  icon: "Gamepad2",

  parameters: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "User ID Mobile Legends.",
      example: "123456789"
    },
    {
      name: "zoneId",
      type: "string",
      required: true,
      description: "Zone ID atau Server ID Mobile Legends.",
      example: "1234"
    }
  ],

  responseExample: {
    status: true,
    source: "DuniaGames",
    data: {
      username: "Example Player",
      gameId: "123456789",
      zoneId: "1234"
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
      description: "Nama sumber data."
    },
    {
      name: "data",
      type: "object",
      description: "Detail akun Mobile Legends dari sumber."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/mlstalk?id=123456789&zoneId=1234"
};