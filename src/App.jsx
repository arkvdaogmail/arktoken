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
  <div>
    <h2>ArkMeep Business Registry</h2>
    <form onSubmit={handleSubmit}>
      <input
        value={bizName}
        onChange={e => setBizName(e.target.value)}
        placeholder="Business Name"
        required
      />
      <input
        value={domain}
        onChange={e => setDomain(e.target.value)}
        placeholder="Business Domain"
        required
      />
      <input
        value={bizWallet}
        onChange={e => setBizWallet(e.target.value)}
        placeholder="Wallet Address"
        required
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="Business">Business</option>
        <option value="DAO">DAO</option>
        <option value="Spiritual">Spiritual</option>
        <option value="Personal">Personal</option>
        <option value="Enterprise">Enterprise</option>
        <option value="Startup">Startup</option>
        <option value="Nonprofit">Nonprofit</option>
        <option value="Creator">Creator</option>
        <option value="GovLegal">GovLegal</option>
      </select>
      <button
        type="button"
        onClick={handleRegister}
      >
        Register
      </button>
    </form>
    {hashID && <p>Generated ID: {hashID}</p>}
  </div>
);
