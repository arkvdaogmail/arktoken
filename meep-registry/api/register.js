export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, domain, wallet, fileCid } = req.body;
    if (!name || !domain || !wallet) return res.status(400).json({ error: 'Missing required fields' });

    const hash = await treeHash({ name, domain, wallet, fileCid });
    const tx = await treeRegister({ hash });

    return res.status(200).json({ hash, tx });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error', details: err.message });
  }
}

async function treeHash(data) {
  const input = JSON.stringify(data);
  const buffer = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Buffer.from(digest).toString('hex');
}

async function treeRegister({ hash }) {
  return `tx_${hash.slice(0, 10)}`;
}
