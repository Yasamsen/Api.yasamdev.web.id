export default {
  slug: "githubstalk",
  name: "GitHub Stalk",
  description: "Mengambil informasi profil pengguna GitHub berdasarkan username.",
  category: "Stalker",
  method: "GET",
  endpoint: "/api/githubstalk",
  icon: "Github",

  parameters: [
    {
      name: "user",
      type: "string",
      required: true,
      description: "Username GitHub yang ingin dicari.",
      example: "Yasamsen"
    }
  ],

  responseExample: {
    status: true,
    source: "GitHub",
    data: {
      username: "Yasamsen",
      nickname: "Yasam",
      bio: "Example bio",
      id: 123456789,
      nodeId: "MDQ6VXNlcjEyMzQ1Njc4OQ==",
      profile_pic: "https://avatars.githubusercontent.com/u/123456789",
      url: "https://github.com/Yasamsen",
      type: "User",
      admin: false,
      company: null,
      blog: "",
      location: "Indonesia",
      email: null,
      public_repo: 10,
      public_gists: 2,
      followers: 100,
      following: 50,
      ceated_at: "2020-01-01T00:00:00Z",
      updated_at: "2026-09-30T00:00:00Z"
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
      description: "Informasi profil GitHub."
    },
    {
      name: "data.username",
      type: "string",
      description: "Username GitHub."
    },
    {
      name: "data.nickname",
      type: "string|null",
      description: "Nama pengguna."
    },
    {
      name: "data.bio",
      type: "string|null",
      description: "Bio pengguna."
    },
    {
      name: "data.id",
      type: "number",
      description: "ID pengguna GitHub."
    },
    {
      name: "data.nodeId",
      type: "string",
      description: "Node ID pengguna GitHub."
    },
    {
      name: "data.profile_pic",
      type: "string",
      description: "URL foto profil."
    },
    {
      name: "data.url",
      type: "string",
      description: "URL profil GitHub."
    },
    {
      name: "data.type",
      type: "string",
      description: "Tipe akun GitHub."
    },
    {
      name: "data.admin",
      type: "boolean",
      description: "Status site administrator GitHub."
    },
    {
      name: "data.company",
      type: "string|null",
      description: "Informasi perusahaan."
    },
    {
      name: "data.blog",
      type: "string",
      description: "URL blog pengguna."
    },
    {
      name: "data.location",
      type: "string|null",
      description: "Lokasi pengguna."
    },
    {
      name: "data.email",
      type: "string|null",
      description: "Email publik pengguna jika tersedia."
    },
    {
      name: "data.public_repo",
      type: "number",
      description: "Jumlah repository publik."
    },
    {
      name: "data.public_gists",
      type: "number",
      description: "Jumlah public gist."
    },
    {
      name: "data.followers",
      type: "number",
      description: "Jumlah followers."
    },
    {
      name: "data.following",
      type: "number",
      description: "Jumlah akun yang diikuti."
    },
    {
      name: "data.ceated_at",
      type: "string",
      description: "Tanggal akun dibuat."
    },
    {
      name: "data.updated_at",
      type: "string",
      description: "Tanggal profil terakhir diperbarui."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/githubstalk?user=Yasamsen"
};