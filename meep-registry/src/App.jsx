import React, { useState, useEffect } from 'react';

export default function RegistryApp() {
  const [bizName, setBizName] = useState('');
  const [domain, setDomain] = useState('');
  const [bizWallet, setBizWallet] = useState('');
  const [category, setCategory] = useState('Business');
  const [hashID, setHashID] = useState('');

  const handleRegister = async () => {
    const payload = {
      name: bizName,
      domain,
      wallet: bizWallet,
      fileCid: ""
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      alert(`✅ Registered!\nHash: ${data.hash}\nTx: ${data.tx}`);
      setHashID(data.hash);
    } catch (err) {
      alert("❌ Registration failed.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>ArkMeep Business Registry</h2>
      <input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Business Name" required />
      <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="Business Domain" required />
      <input value={bizWallet} onChange={e => setBizWallet(e.target.value)} placeholder="Wallet Address" required />
      <select value={category} onChange={e => setCategory(e.target.value)}>
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
      <button type="button" onClick={handleRegister}>Register</button>
      {hashID && <p>Generated ID: {hashID}</p>}
    </div>
  );
}
