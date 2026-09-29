export default {
  slug: "earthquake",
  name: "Gempa Terkini",
  description:
    "Get the latest earthquake information in Indonesia directly from BMKG.",
  category: "Information",
  method: "GET",
  endpoint: "/api/earthquake",
  icon: "Activity",

  parameters: [],

  responseExample: {
    status: true,
    source: "BMKG",
    data: {
      tanggal: "25 Sep 2026",
      jam: "04:01:35 WIB",
      magnitude: "3.7",
      kedalaman: "7 km",
      lokasi: "17 km Timur Jantho Aceh Besar",
      potensi: "Tidak berpotensi tsunami"
    }
  },

  responseFields: [
    {
      name: "tanggal",
      type: "string",
      description: "Tanggal kejadian gempa."
    },
    {
      name: "jam",
      type: "string",
      description: "Waktu kejadian gempa."
    },
    {
      name: "magnitude",
      type: "string",
      description: "Magnitudo gempa."
    },
    {
      name: "kedalaman",
      type: "string",
      description: "Kedalaman pusat gempa."
    },
    {
      name: "lokasi",
      type: "string",
      description: "Lokasi atau wilayah pusat gempa."
    },
    {
      name: "potensi",
      type: "string",
      description: "Informasi potensi tsunami dari BMKG."
    },
    {
      name: "dirasakan",
      type: "string",
      description: "Wilayah yang merasakan gempa jika tersedia."
    },
    {
      name: "shakemap",
      type: "string",
      description: "URL peta guncangan BMKG jika tersedia."
    }
  ]
};