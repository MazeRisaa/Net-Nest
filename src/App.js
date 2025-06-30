import React, { useState } from "react";

export default function App() {
  // User login state
  const [user, setUser] = useState(null);
  const [loginName, setLoginName] = useState("");

  // Hotspots state
  const [hotspots, setHotspots] = useState([
    { id: 1, owner: "Alice", pricePerMB: 0.05, availableMB: 500 },
    { id: 2, owner: "Bob", pricePerMB: 0.03, availableMB: 300 },
  ]);

  // Balance and transactions state
  const [balance, setBalance] = useState(20);
  const [dataUsed, setDataUsed] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // New hotspot form state
  const [newHotspotOwner, setNewHotspotOwner] = useState("");
  const [newHotspotPrice, setNewHotspotPrice] = useState("");
  const [newHotspotData, setNewHotspotData] = useState("");

  // Handle login form submit
  const handleLogin = (e) => {
    e.preventDefault();
    const trimmed = loginName.trim();
    if (trimmed.length < 3) {
      alert("Please enter a username with at least 3 characters.");
      return;
    }
    setUser(trimmed);
    setLoginName("");
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setBalance(20);
    setDataUsed(0);
    setTransactions([]);
    setHotspots([
      { id: 1, owner: "Alice", pricePerMB: 0.05, availableMB: 500 },
      { id: 2, owner: "Bob", pricePerMB: 0.03, availableMB: 300 },
    ]);
  };

  // Rent data function
  const rentData = (hotspotId, mb = 10) => {
    const hotspot = hotspots.find((h) => h.id === hotspotId);
    if (!hotspot) return;
    const cost = hotspot.pricePerMB * mb;
    if (balance >= cost && hotspot.availableMB >= mb) {
      setBalance((prev) => prev - cost);
      setDataUsed((prev) => prev + mb);
      setHotspots(
        hotspots.map((h) =>
          h.id === hotspotId ? { ...h, availableMB: h.availableMB - mb } : h
        )
      );
      setTransactions((prev) => [
        { id: Date.now(), hotspotOwner: hotspot.owner, mb, cost: cost.toFixed(2) },
        ...prev,
      ]);
    } else {
      alert("Not enough balance or data available.");
    }
  };

  // Add new hotspot
  const addHotspot = (e) => {
    e.preventDefault();
    if (!newHotspotOwner || !newHotspotPrice || !newHotspotData) {
      alert("Please fill all fields.");
      return;
    }
    setHotspots((prev) => [
      ...prev,
      {
        id: Date.now(),
        owner: newHotspotOwner,
        pricePerMB: parseFloat(newHotspotPrice),
        availableMB: parseInt(newHotspotData, 10),
      },
    ]);
    setNewHotspotOwner("");
    setNewHotspotPrice("");
    setNewHotspotData("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <BackgroundCircles />
        <form
          onSubmit={handleLogin}
          className="bg-[#121212] p-10 rounded-2xl shadow-glow w-full max-w-md relative z-10"
        >
          <h1 className="text-4xl font-bold mb-8 text-indigo-400 text-center tracking-wide select-none">
            NetNest Login
          </h1>
          <input
            type="text"
            placeholder="Enter username"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-[#1E1E2F] border border-indigo-600 placeholder-indigo-400 text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 transition"
          />
          <button type="submit" className="colorful-btn w-full">
            Log In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-indigo-200 font-sans max-w-4xl mx-auto p-8 relative overflow-hidden"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      }}
    >
      <BackgroundCircles />
      <header className="flex justify-between items-center mb-12 relative z-10">
        <h1 className="text-5xl font-extrabold text-indigo-400 tracking-wide select-none">
          NetNest
        </h1>
        <div className="flex items-center space-x-4">
          <p className="text-indigo-300">
            Hello, <strong>{user}</strong>
          </p>
          <button onClick={handleLogout} className="colorful-btn px-4 py-2 text-sm">
            Logout
          </button>
        </div>
      </header>

      <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
        <div className="bg-[#1E1E2F] rounded-2xl p-8 shadow-glow flex flex-col justify-center items-center">
          <p className="text-2xl font-semibold mb-2">Balance</p>
          <p className="text-4xl font-bold text-indigo-400">${balance.toFixed(2)}</p>
        </div>
        <div className="bg-[#1E1E2F] rounded-2xl p-8 shadow-glow flex flex-col justify-center items-center">
          <p className="text-2xl font-semibold mb-2">Data Used</p>
          <p className="text-4xl font-bold text-indigo-400">{dataUsed} MB</p>
        </div>
      </section>

      <section className="mb-12 relative z-10">
        <h2 className="text-3xl font-semibold mb-6 border-b border-indigo-600 pb-3">
          Share Your Hotspot
        </h2>
        <form
          onSubmit={addHotspot}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center"
        >
          <input
            type="text"
            placeholder="Your name"
            value={newHotspotOwner}
            onChange={(e) => setNewHotspotOwner(e.target.value)}
            className="flex-1 bg-[#1E1E2F] border border-indigo-600 rounded-lg px-5 py-3 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price per MB"
            value={newHotspotPrice}
            onChange={(e) => setNewHotspotPrice(e.target.value)}
            className="w-40 bg-[#1E1E2F] border border-indigo-600 rounded-lg px-5 py-3 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="number"
            placeholder="Available data (MB)"
            value={newHotspotData}
            onChange={(e) => setNewHotspotData(e.target.value)}
            className="w-48 bg-[#1E1E2F] border border-indigo-600 rounded-lg px-5 py-3 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button type="submit" className="colorful-btn px-6 py-3 font-semibold">
            Share
          </button>
        </form>
      </section>

      <section className="mb-12 relative z-10">
        <h2 className="text-3xl font-semibold mb-6 border-b border-indigo-600 pb-3">
          Available Hotspots
        </h2>
        {hotspots.length === 0 && (
          <p className="text-indigo-400 text-center">No hotspots available.</p>
        )}
        <ul className="space-y-6">
          {hotspots.map((h) => (
            <li
              key={h.id}
              className="bg-[#1E1E2F] rounded-2xl p-6 shadow-glow flex justify-between items-center hover:shadow-indigo-500/70 transition"
            >
              <div>
                <p className="text-xl font-semibold">{h.owner}</p>
                <p className="text-indigo-400">${h.pricePerMB.toFixed(2)} per MB</p>
                <p className="text-indigo-300">{h.availableMB} MB available</p>
              </div>
              <button
                onClick={() => rentData(h.id)}
                disabled={h.availableMB < 10 || balance < h.pricePerMB * 10}
                className="colorful-btn px-6 py-3 font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Rent 10 MB
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative z-10">
        <h2 className="text-3xl font-semibold mb-6 border-b border-indigo-600 pb-3">
          Transaction History
        </h2>
        {transactions.length === 0 ? (
          <p className="text-indigo-400 text-center">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-indigo-700">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="py-4 flex justify-between text-indigo-300 font-mono text-sm"
              >
                <span>
                  Rented {t.mb} MB from <strong>{t.hotspotOwner}</strong>
                </span>
                <span>${t.cost}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function BackgroundCircles() {
  return (
    <div className="background-circles" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
