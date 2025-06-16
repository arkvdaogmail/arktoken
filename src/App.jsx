import React, { useState, useEffect } from 'react';

const Connex = window.Connex;

const CONTRACT_ADDRESS = "0x4f6FC409e152D33843Cf4982d414C1Dd0879277e";
const ABI = [{
  "constant": false,
  "inputs": [
    { "name": "name", "type": "string" },
    { "name": "domain", "type": "string" },
    { "name": "wallet", "type": "string" },
    { "name": "category", "type": "string" },
    { "name": "id", "type": "string" }
  ],
  "name": "registerBusiness",
  "outputs": [],
  "type": "function"
}];

export default function RegistryApp() {
  const [wallet, setWallet] = useState(null);
  const [bizName, setBizName] = useState('');
  const [category, setCategory] = useState('Business');
  const [domain, setDomain] = useState('');
  const [bizWallet, setBizWallet] = useState('');
  const [hashID, setHashID] = useState('');

  useEffect(() => {
    if (!wallet && Connex) {
      const connex = new Connex({ node: 'https://testnet.veblocks.net', network: 'test' });
      setWallet(connex);
    }
  }, []);

  const generateHash = (input) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    return crypto.subtle.digest('SHA-256', data).then((buffer) => {
      const hashArray = Array.from(new Uint8Array(buffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `BIZ-${hashHex.slice(0, 10).toUpperCase()}`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = await generateHash(bizName + category + domain + bizWallet);
    setHashID(id);
    console.log('Generated ID:', id);

    if (wallet) {
      const contract = wallet.thor.account(CONTRACT_ADDRESS).method(ABI[0]);
      const tx = await contract.request(
        bizName,
        domain,
        bizWallet,
        category,
        id
      );
      console.log('TX request:', tx);
    }
  };

  const handleRegister = async () => {
    const payload = {
      name: bizName,
      domain: domain,
      wallet: bizWallet,
      fileCid: ""
    };

    try {
      const res = await fetch("https://arktoken-three.vercel.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("Registry response:", data);
      alert(`✅ Registered on Meep!\nHash: ${data.hash}\nTx: ${data.tx}`);
    } catch (err) {
      console.error("Register error:", err);
      alert("❌ Registration failed.");
    }
  };

return (
  <div style={{
    backgroundColor: '#121212',
    color: '#f0f0f0',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Arial'
  }}>
    <h2>ArkMeep Business Registry</h2>
    <form onSubmit={handleSubmit}>
      <input
        value={bizName}
        onChange={e => setBizName(e.target.value)}
        placeholder="Business Name"
        required
        style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0', margin: '0.5rem', padding: '0.5rem' }}
      />
      <input
        value={domain}
        onChange={e => setDomain(e.target.value)}
        placeholder="Business Domain"
        required
        style={{ backgroundColor: '#1e1e1e', color: '#f0f0f0', margin: '0.5rem', padding: '0.5rem' }}
      />
      <input
        value={bizWallet}
        onChange={e => setBizWallet(e.target.value)}
        placeholder="Wallet Address"
        required
        style={{
