export default {
  slug: "check-host",
  name: "Check Host",
  description: "Cek lengkap sebuah website/host tanpa API key: DNS, IP & geolokasi, status HTTP + redirect, HTTPS/SSL/TLS, HSTS, header keamanan, port TCP, dan data RDAP (WHOIS).",
  category: "Utility",
  method: "POST",
  endpoint: "/api/check-host",
  icon: "Globe",
  parameters: [
    {
      name: "url",
      type: "string",
      required: true,
      description: "Domain, IP, atau URL lengkap yang ingin dicek. Skema https:// dipakai jika tidak ditulis.",
      example: "example.com"
    },
    {
      name: "checks",
      type: "string",
      required: false,
      description: "Opsional, pisahkan dengan koma. Pilihan: dns, ip, http, https, ports, whois, security. Kosong = semua.",
      example: "dns,ip,http,https"
    },
    {
      name: "ports",
      type: "string",
      required: false,
      description: "Opsional, port tambahan (selain 80 & 443), pisahkan dengan koma. Hanya port umum: 21,22,25,53,110,143,465,587,993,995,3306,3389,5432,8080,8443.",
      example: "22,3306"
    }
  ],
  responseExample: {
    success: true,
    checkedAt: "2026-10-21T03:00:00.000Z",
    durationMs: 2140,
    data: {
      target: { hostname: "example.com", scheme: "https", port: 443, url: "https://example.com/", apexDomain: "example.com" },
      resolve: { resolved: true, timeMs: 12, addresses: [{ address: "93.184.216.34", version: 4 }] },
      dns: { A: [{ address: "93.184.216.34", ttl: 300 }], AAAA: [], NS: ["a.iana-servers.net"], MX: [], TXT: [], email: { spf: null, dmarc: null } },
      ips: [{ ip: "93.184.216.34", reverse: [], geo: { country: "United States", city: "Los Angeles", asn: "AS15133", isp: "Edgecast" } }],
      http: {
        reachable: true, status: 200, finalUrl: "https://example.com/", redirectCount: 0,
        timing: { dnsMs: 12, connectMs: 18, tlsMs: 40, ttfbMs: 95, totalMs: 110 },
        server: "ECS", compression: "gzip", page: { title: "Example Domain" }
      },
      https: {
        supported: true, tlsVersion: "TLSv1.3", http2: true, certificateTrusted: true,
        protocols: { "TLSv1.3": true, "TLSv1.2": true },
        certificate: { subject: "www.example.org", issuer: "DigiCert", validTo: "2027-01-01T00:00:00.000Z", daysRemaining: 72 },
        httpToHttps: { redirectsToHttps: true, status: 301 },
        hsts: { enabled: false }
      },
      security: { score: 15, grade: "F", missing: ["Content-Security-Policy"] },
      ports: [{ port: 80, service: "HTTP", open: true, latencyMs: 17 }, { port: 443, service: "HTTPS", open: true, latencyMs: 18 }],
      whois: { available: true, registrar: "RESERVED-Internet Assigned Numbers Authority", expiresAt: "2026-08-13T04:00:00Z" },
      summary: { online: true, statusCode: 200, responseTimeMs: 110, https: true, certificateValid: true, securityGrade: "F", issues: ["HSTS belum aktif."] }
    }
  },
  responseFields: [
    { name: "success", type: "boolean", description: "Apakah pemeriksaan berhasil dijalankan." },
    { name: "durationMs", type: "number", description: "Total durasi pemeriksaan." },
    { name: "data.resolve", type: "object", description: "Hasil resolve hostname ke IP (IPv4/IPv6)." },
    { name: "data.dns", type: "object", description: "Record A, AAAA, CNAME, NS, MX, TXT, SOA, CAA, serta SPF & DMARC." },
    { name: "data.ips", type: "array", description: "Tiap IP: reverse DNS, negara, kota, ASN, ISP." },
    { name: "data.http", type: "object", description: "Status code, redirect chain, timing (connect/TLS/TTFB), header, server, CDN/WAF terdeteksi, title halaman, cookie." },
    { name: "data.https", type: "object", description: "Dukungan TLS 1.2/1.3, HTTP/2, detail sertifikat & chain, redirect HTTP→HTTPS, HSTS." },
    { name: "data.security", type: "object", description: "Skor & nilai header keamanan beserta header yang belum ada." },
    { name: "data.ports", type: "array", description: "Status port TCP terbuka/tertutup beserta latency." },
    { name: "data.whois", type: "object", description: "Data RDAP: registrar, tanggal registrasi/kedaluwarsa, nameserver (atau info blok IP)." },
    { name: "data.summary", type: "object", description: "Ringkasan cepat dan daftar temuan (issues)." }
  ],
  exampleRequest: "POST https://samapi.example.com/api/check-host\nContent-Type: application/json\n\n{\"url\":\"example.com\",\"ports\":\"22,3306\"}"
};
