import React, { useEffect, useState } from "react";
import "../../styles/dashboard.css"; // ✅ your main styling
import { apiGet, apiPost } from "../../lib/api";

interface SpinReward {
  label: string;
  type: "coins" | "mystery_box" | "extra_spin" | "nothing";
  value: number;
  weight: number;
}

interface SpinConfig {
  _id?: string;
  rewards: SpinReward[];
  freeCooldownHours: number;
  premiumCooldownHours: number;
  version: number;
  status?: string;
}

interface BoxPool {
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  weight: number;
}

interface BoxConfig {
  _id?: string;
  pools: BoxPool[];
  packSize: number;
  version: number;
  status?: string;
}

export default function AdminGames() {
  const [loading, setLoading] = useState(true);
  const [spin, setSpin] = useState<SpinConfig>({
    rewards: [],
    freeCooldownHours: 24,
    premiumCooldownHours: 6,
    version: 1,
  });
  const [box, setBox] = useState<BoxConfig>({
    pools: [],
    packSize: 1,
    version: 1,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    setLoading(true);
    try {
      const res = await apiGet("/api/admin/games");
      const data = await res.json();
      if (data.success) {
        setSpin(data.data.spin);
        setBox(data.data.box);
      } else alert("Failed to load game config");
    } catch (err) {
      console.error(err);
      alert("Error loading config");
    }
    setLoading(false);
  }

  async function saveConfig(publish = false) {
    try {
      const res = await apiPost("/api/admin/games", { spin, box, publish });
      const data = await res.json();
      if (data.success) {
        alert(publish ? "Config published!" : "Draft saved!");
        loadConfig();
      } else {
        alert(data.error || "Save failed");
      }
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  function updateReward(i: number, field: keyof SpinReward, value: any) {
    setSpin((prev) => {
      const rewards = [...prev.rewards];
      rewards[i] = { ...rewards[i], [field]: value };
      return { ...prev, rewards };
    });
  }

  function updatePool(i: number, field: keyof BoxPool, value: any) {
    setBox((prev) => {
      const pools = [...prev.pools];
      pools[i] = { ...pools[i], [field]: value };
      return { ...prev, pools };
    });
  }

  if (loading) return <p className="p-6">Loading game configuration...</p>;

  return (
    <main className="grovi-main">
      <div className="grovi-topnav">
        <h1 style={{ marginLeft: 20 }}>🎮 Game Configuration</h1>
      </div>

      <div style={{ padding: 24 }}>
        {/* Spin Config */}
        <section className="panel">
          <div className="panel-inner">
            <h2>Spin the Wheel</h2>
            <p className="muted small">Configure spin rewards and cooldowns.</p>

            {spin.rewards.length > 0 ? (
              spin.rewards.map((r, i) => (
                <div key={i} className="panel bordered" style={{ marginBottom: 10 }}>
                  <input
                    value={r.label}
                    onChange={(e) => updateReward(i, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <select
                    value={r.type}
                    onChange={(e) =>
                      updateReward(i, "type", e.target.value as SpinReward["type"])
                    }
                  >
                    <option value="coins">Coins</option>
                    <option value="mystery_box">Mystery Box</option>
                    <option value="extra_spin">Extra Spin</option>
                    <option value="nothing">Nothing</option>
                  </select>
                  <input
                    type="number"
                    value={r.value}
                    onChange={(e) => updateReward(i, "value", Number(e.target.value))}
                    placeholder="Value"
                  />
                  <input
                    type="number"
                    value={r.weight}
                    onChange={(e) => updateReward(i, "weight", Number(e.target.value))}
                    placeholder="Weight"
                  />
                  <button
                    className="cb-action-btn danger"
                    onClick={() =>
                      setSpin((prev) => ({
                        ...prev,
                        rewards: prev.rewards.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="muted small">No rewards defined.</p>
            )}

            <button
              className="cb-action-btn"
              onClick={() =>
                setSpin((prev) => ({
                  ...prev,
                  rewards: [...prev.rewards, { label: "", type: "coins", value: 1, weight: 10 }],
                }))
              }
            >
              + Add Reward
            </button>

            <div style={{ marginTop: 20 }}>
              <label>Free Spin Cooldown (hours)</label>
              <input
                type="number"
                value={spin.freeCooldownHours}
                onChange={(e) =>
                  setSpin({ ...spin, freeCooldownHours: Number(e.target.value) })
                }
              />

              <label>Premium Spin Cooldown (hours)</label>
              <input
                type="number"
                value={spin.premiumCooldownHours}
                onChange={(e) =>
                  setSpin({ ...spin, premiumCooldownHours: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </section>

        {/* Box Config */}
        <section className="panel">
          <div className="panel-inner">
            <h2>Mystery Box</h2>
            <p className="muted small">Configure drop rates and pack size.</p>

            {box.pools.length > 0 ? (
              box.pools.map((p, i) => (
                <div key={i} className="panel bordered" style={{ marginBottom: 10 }}>
                  <select
                    value={p.rarity}
                    onChange={(e) =>
                      updatePool(i, "rarity", e.target.value as BoxPool["rarity"])
                    }
                  >
                    <option value="Common">Common</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                  <input
                    type="number"
                    value={p.weight}
                    onChange={(e) => updatePool(i, "weight", Number(e.target.value))}
                    placeholder="Weight"
                  />
                  <button
                    className="cb-action-btn danger"
                    onClick={() =>
                      setBox((prev) => ({
                        ...prev,
                        pools: prev.pools.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="muted small">No rarity pools defined.</p>
            )}

            <button
              className="cb-action-btn"
              onClick={() =>
                setBox((prev) => ({
                  ...prev,
                  pools: [...prev.pools, { rarity: "Common", weight: 60 }],
                }))
              }
            >
              + Add Pool
            </button>

            <div style={{ marginTop: 20 }}>
              <label>Cards per Box</label>
              <input
                type="number"
                value={box.packSize}
                onChange={(e) =>
                  setBox({ ...box, packSize: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </section>

        <div className="flex gap-4" style={{ marginTop: 20 }}>
          <button className="cb-action-btn" onClick={() => saveConfig(false)}>
            💾 Save Draft
          </button>
          <button
            className="cb-action-btn"
            style={{ background: "#2e5632", color: "#fff" }}
            onClick={() => saveConfig(true)}
          >
            🚀 Publish Config
          </button>
        </div>
      </div>
    </main>
  );
}
