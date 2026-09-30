import { handleUpload } from '@vercel/blob/client';
export default async function handler(req, res) {
  try {
    const json = await handleUpload({
      body: req.body, request: req,
      onBeforeGenerateToken: async (_path, payload) => {
        const key = process.env.UPLOAD_KEY; // opsional: kode rahasia upload
        if (key && payload !== key) throw new Error('Kode upload salah');
        return { allowedContentTypes: ['audio/*'], maximumSizeInBytes: 60 * 1024 * 1024, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    res.status(200).json(json);
  } catch (e) { res.status(400).json({ error: e.message }); }
}
