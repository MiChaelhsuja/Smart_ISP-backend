const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // <-- serve your web GUI

const DATA_FILE = "./subscribers.json";
const GENIEACS_API = process.env.GENIEACS_API || "http://localhost:7557";
const PORT = process.env.PORT || 4000;

// --- Helper functions ---
const loadSubs = () =>
  fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
const saveSubs = (subs) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(subs, null, 2));

// --- ROUTES ---

// 🧩 Add or update subscriber
app.post("/api/subscribers", (req, res) => {
  const { name, plan, town, serial } = req.body;
  if (!name || !serial)
    return res.status(400).json({ error: "Name & Serial required" });

  let subs = loadSubs();
  let sub = subs.find((s) => s.serial === serial);
  if (sub) {
    Object.assign(sub, { name, plan, town });
  } else {
    subs.push({ id: Date.now(), name, plan, town, serial, active: true });
  }
  saveSubs(subs);
  res.json({ message: "Subscriber saved", subscribers: subs });
});

// 🧩 Get all subscribers
app.get("/api/subscribers", (req, res) => {
  res.json(loadSubs());
});

// 🧩 Fetch live devices from GenieACS
app.get("/api/devices", async (req, res) => {
  try {
    const { data } = await axios.get(`${GENIEACS_API}/devices`);
    res.json(Object.values(data));
  } catch (err) {
    console.error("Error fetching devices:", err.message);
    res.status(500).json({ error: "Failed to fetch GenieACS devices" });
  }
});

// 🧩 Merge subscribers + devices
app.get("/api/merged", async (req, res) => {
  try {
    const subs = loadSubs();
    const { data } = await axios.get(`${GENIEACS_API}/devices`);
    const devices = Object.values(data);

    const merged = subs.map((sub) => {
      const dev = devices.find(
        (d) => d._id === sub.serial.toString() || d._id.endsWith(sub.serial)
      );
      return {
        ...sub,
        lastInform: dev?.lastInform || null,
        model:
          dev?.summary?.match(/ModelName\s=\s([^\s]+)/)?.[1] || "Unknown",
        online: !!dev,
      };
    });

    res.json(merged);
  } catch (err) {
    console.error("Merge error:", err.message);
    res.status(500).json({ error: "Failed to merge data" });
  }
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`🚀 ISP backend + GUI running at http://localhost:${PORT}`);
});
