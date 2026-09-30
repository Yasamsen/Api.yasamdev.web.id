export default {
  slug: "npmstalk",
  name: "NPM Stalk",
  description: "Mendapatkan informasi versi, dependency, dan waktu publikasi package NPM.",
  category: "Tools",
  method: "GET",
  endpoint: "/api/npmstalk",
  icon: "Package",
  parameters: [
    {
      name: "package",
      type: "string",
      required: true,
      description: "Nama package NPM yang ingin diperiksa.",
      example: "axios"
    }
  ],
  responseExample: {
    status: true,
    source: "NPM Registry",
    data: {
      name: "axios",
      versionLatest: "1.x.x",
      versionPublish: "0.x.x",
      versionUpdate: 100,
      latestDependencies: 10,
      publishDependencies: 2,
      publishTime: "2015-08-24T00:00:00.000Z",
      latestPublishTime: "2026-09-30T00:00:00.000Z"
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
      description: "Sumber data package."
    },
    {
      name: "data.name",
      type: "string",
      description: "Nama package NPM."
    },
    {
      name: "data.versionLatest",
      type: "string",
      description: "Versi terbaru package."
    },
    {
      name: "data.versionPublish",
      type: "string",
      description: "Versi package pada publikasi awal."
    },
    {
      name: "data.versionUpdate",
      type: "number",
      description: "Jumlah versi yang tersedia."
    },
    {
      name: "data.latestDependencies",
      type: "number",
      description: "Jumlah dependency pada versi terbaru."
    },
    {
      name: "data.publishDependencies",
      type: "number",
      description: "Jumlah dependency pada versi publikasi awal."
    },
    {
      name: "data.publishTime",
      type: "string",
      description: "Waktu package pertama kali dibuat."
    },
    {
      name: "data.latestPublishTime",
      type: "string",
      description: "Waktu versi terbaru dipublikasikan."
    }
  ],
  exampleRequest: "https://samapi.example.com/api/npmstalk?package=axios"
};