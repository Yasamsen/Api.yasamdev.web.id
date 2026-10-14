export default {
  "slug": "add-subdomain",
  "name": "Add Subdomain (Cloudflare)",
  "description": "Create a DNS record for a subdomain under the server-configured root domain. TTL and Cloudflare credentials are configured on the server.",
  "category": "Utility",
  "method": "POST",
  "endpoint": "/api/add-subdomain",
  "icon": "Globe",
  "parameters": [
    {
      "name": "subdomain",
      "type": "string",
      "required": true,
      "description": "Nama label subdomain saja, tanpa domain utama.",
      "example": "panel"
    },
    {
      "name": "type",
      "type": "select",
      "required": true,
      "description": "Jenis record DNS.",
      "options": [
        "A",
        "AAAA",
        "CNAME",
        "TXT"
      ],
      "example": "A"
    },
    {
      "name": "content",
      "type": "string",
      "required": true,
      "description": "IP atau nilai DNS record. A=IPv4, AAAA=IPv6, CNAME=hostname, TXT=teks.",
      "example": "203.0.113.10"
    },
    {
      "name": "proxied",
      "type": "select",
      "required": true,
      "description": "Status proxy Cloudflare. TXT otomatis nonaktif.",
      "options": [
        {
          "label": "Inactive",
          "value": "false"
        },
        {
          "label": "Active",
          "value": "true"
        }
      ],
      "example": "false"
    }
  ],
  "responseExample": {
    "success": true,
    "message": "DNS record berhasil dibuat.",
    "data": {
      "name": "panel.example.com",
      "type": "A",
      "content": "203.0.113.10",
      "ttl": 3600,
      "proxied": false
    }
  },
  "responseFields": [
    {
      "name": "success",
      "type": "boolean",
      "description": "Apakah request berhasil."
    },
    {
      "name": "data.name",
      "type": "string",
      "description": "Nama domain penuh yang dibuat."
    },
    {
      "name": "data.type",
      "type": "string",
      "description": "Jenis DNS record."
    },
    {
      "name": "data.content",
      "type": "string",
      "description": "Nilai record."
    }
  ],
  "exampleRequest": "POST https://samapi.example.com/api/add-subdomain"
};
