export default {
  slug: "mealdb",
  name: "TheMealDB Recipes",
  description: "Mencari dan mengambil resep makanan dari TheMealDB.",
  category: "Food",
  method: "GET",
  endpoint: "/api/mealdb",
  icon: "Utensils",

  parameters: [
    {
      name: "action",
      type: "string",
      required: true,
      description: "Jenis operasi: search, detail, atau random.",
      example: "search"
    },
    {
      name: "query",
      type: "string",
      required: false,
      description: "Nama makanan yang ingin dicari. Digunakan dengan action=search.",
      example: "chicken"
    },
    {
      name: "id",
      type: "string",
      required: false,
      description: "ID resep TheMealDB. Digunakan dengan action=detail.",
      example: "52772"
    }
  ],

  responseExample: {
    status: true,
    source: "TheMealDB",
    action: "search",
    total: 1,
    data: [
      {
        id: "52772",
        name: "Teriyaki Chicken Casserole",
        category: "Chicken",
        area: "Japanese",
        instructions: "...",
        thumbnail: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
        youtube: null,
        source: null,
        ingredients: [
          {
            ingredient: "Chicken Breasts",
            measure: "4"
          }
        ]
      }
    ]
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
      description: "Sumber data resep."
    },
    {
      name: "data",
      type: "array/object",
      description: "Data resep makanan."
    }
  ]
};