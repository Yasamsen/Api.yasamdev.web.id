export default {
  slug: "weather",
  name: "Weather",
  description: "Get current weather information for a city.",
  category: "Weather",
  method: "GET",
  endpoint: "/api/weather",
  icon: "CloudSun",

  parameters: [
    {
      name: "city",
      type: "string",
      required: true,
      description: "City name to get weather information.",
      example: "Jakarta"
    }
  ],

  responseExample: {
    success: true,
    data: {
      city: "Jakarta",
      country: "Indonesia",
      region: "Jakarta Raya",
      temperature: {
        celsius: 30,
        fahrenheit: 86,
        feelsLikeCelsius: 34,
        feelsLikeFahrenheit: 93
      },
      condition: "Partly cloudy",
      humidity: 70,
      cloudCover: 50,
      visibilityKm: 10,
      pressureMb: 1010,
      windSpeedKph: 12,
      windDirection: "NW",
      uvIndex: 6,
      observationTime: "2026-09-25 12:00 PM"
    }
  },

  responseFields: [
    {
      name: "success",
      type: "boolean",
      description: "Whether the request succeeded."
    },
    {
      name: "data.city",
      type: "string",
      description: "City name."
    },
    {
      name: "data.country",
      type: "string",
      description: "Country name."
    },
    {
      name: "data.temperature.celsius",
      type: "number",
      description: "Temperature in Celsius."
    },
    {
      name: "data.temperature.fahrenheit",
      type: "number",
      description: "Temperature in Fahrenheit."
    },
    {
      name: "data.temperature.feelsLikeCelsius",
      type: "number",
      description: "Feels-like temperature in Celsius."
    },
    {
      name: "data.condition",
      type: "string",
      description: "Current weather condition."
    },
    {
      name: "data.humidity",
      type: "number",
      description: "Relative humidity percentage."
    },
    {
      name: "data.windSpeedKph",
      type: "number",
      description: "Wind speed in kilometers per hour."
    },
    {
      name: "data.windDirection",
      type: "string",
      description: "Wind direction."
    },
    {
      name: "data.uvIndex",
      type: "number",
      description: "Current UV index."
    }
  ],

  exampleRequest:
    "https://samapi.example.com/api/weather?city=Jakarta"
};