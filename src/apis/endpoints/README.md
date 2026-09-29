# Auto-detected API endpoints

Tambahkan endpoint baru sebagai file `.js` di folder ini atau subfolder-nya. Tidak perlu mengedit `registry.js`.

Contoh:

```js
export default {
  slug: 'facebook',
  name: 'Facebook Downloader',
  description: 'Download Facebook media.',
  category: 'Downloader',
  method: 'GET',
  endpoint: '/api/download/facebook',
  icon: 'Facebook',
  parameters: [
    {
      name: 'url',
      type: 'string',
      required: true,
      description: 'URL Facebook.',
      example: 'https://www.facebook.com/...'
    }
  ],
  responseExample: { success: true, data: {} },
  responseFields: [],
  exampleRequest: 'https://samapi.example.com/api/download/facebook?url=...'
};
```

Subfolder juga otomatis terdeteksi, misalnya `download/facebook.js`.

Jika field dokumentasi tidak lengkap, registry akan mengisi nilai dasar secara otomatis. Untuk dokumentasi yang sama lengkapnya dengan endpoint lama, isi metadata seperti contoh di atas.
