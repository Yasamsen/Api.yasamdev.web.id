export default {
  slug: "imgviral",
  name: "Image-Viral",
  description: "Get a random viral image.",
  category: "Media",
  method: "GET",
  endpoint: "/api/imgviral",
  icon: "Image",

  parameters: [],

  responseExample: "Binary image response (image/jpeg)",

  responseFields: [
    { name: "(binary)", type: "image", description: "Random viral image returned directly as the response body." }
  ],

  exampleRequest: "https://samapi.example.com/api/imgviral"
};