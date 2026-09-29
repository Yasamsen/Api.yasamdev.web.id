export default {
  slug: "prime-ff",
  name: "Kalkulator Prime Free Fire",
  description:
    "Mengonversi Poin Prime Free Fire menjadi estimasi diamond dan harga rupiah.",
  category: "Tools",
  method: "GET",
  endpoint: "/api/prime-ff",
  icon: "Gamepad2",

  parameters: [
    {
      name: "poin",
      type: "number",
      required: true,
      description: "Jumlah Poin Prime Free Fire."
    }
  ],

  exampleRequest:
    "/api/prime-ff?poin=12900"
};