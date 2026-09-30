import { list } from '@vercel/blob';
export default async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: 'sounds/' });
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(blobs.map(b => ({ url: b.url, name: b.pathname.replace('sounds/', ''), size: b.size })));
  } catch (e) { res.status(500).json({ error: e.message }); }
}
