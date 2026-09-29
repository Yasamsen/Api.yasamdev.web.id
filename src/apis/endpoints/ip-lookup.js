export default {
  "slug": "ip-lookup",
  "name": "IP Address Lookup",
  "description": "Lookup geolocation, ISP, and network information for any IP address.",
  "category": "Utility",
  "method": "GET",
  "endpoint": "/api/ip-lookup",
  "icon": "Globe",
  "parameters": [
    {
      "name": "ip",
      "type": "string",
      "required": false,
      "description": "IP address to lookup (defaults to caller IP if omitted).",
      "example": "8.8.8.8"
    }
  ],
  "responseExample": {
    "success": true,
    "data": {
      "ip": "8.8.8.8",
      "city": "Mountain View",
      "region": "California",
      "country": "United States",
      "countryCode": "US",
      "latitude": 37.3861,
      "longitude": -122.084,
      "timezone": "America/Los_Angeles",
      "isp": "Google LLC",
      "org": "Google LLC"
    }
  },
  "responseFields": [
    {
      "name": "success",
      "type": "boolean",
      "description": "Whether the request succeeded."
    },
    {
      "name": "data.ip",
      "type": "string",
      "description": "Queried IP address."
    },
    {
      "name": "data.city",
      "type": "string",
      "description": "City name."
    },
    {
      "name": "data.country",
      "type": "string",
      "description": "Country name."
    },
    {
      "name": "data.isp",
      "type": "string",
      "description": "Internet Service Provider."
    }
  ],
  "exampleRequest": "https://samapi.example.com/api/ip-lookup?ip=8.8.8.8"
};
