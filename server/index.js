// server/index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

// ============================================
// Yasno API (Київ, Дніпро)
// ============================================

// Графік для області та DSO
app.get("/api/yasno/planned-outages/:regionId/:dsoId", async (req, res) => {
  const { regionId, dsoId } = req.params;
  try {
    const url = `https://app.yasno.ua/api/blackout-service/public/shutdowns/regions/${regionId}/dsos/${dsoId}/planned-outages`;
    console.log("Yasno planned-outages URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Помилка Yasno planned-outages:", error);
    res.status(500).json({ error: "Не вдалося отримати графік" });
  }
});

// Пошук вулиць
app.get("/api/yasno/streets", async (req, res) => {
  const { regionId, dsoId, query } = req.query;
  try {
    const url = `https://app.yasno.ua/api/blackout-service/public/shutdowns/addresses/v2/streets?regionId=${regionId}&dsoId=${dsoId}&query=${encodeURIComponent(query)}`;
    console.log("Yasno streets URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Помилка Yasno streets:", error);
    res.status(500).json({ error: "Не вдалося знайти вулиці" });
  }
});

// Пошук будинків
app.get("/api/yasno/houses", async (req, res) => {
  const { regionId, dsoId, streetId, query } = req.query;
  try {
    const url = `https://app.yasno.ua/api/blackout-service/public/shutdowns/addresses/v2/houses?regionId=${regionId}&dsoId=${dsoId}&streetId=${streetId}&query=${encodeURIComponent(query)}`;
    console.log("Yasno houses URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Помилка Yasno houses:", error);
    res.status(500).json({ error: "Не вдалося знайти будинки" });
  }
});

// Визначення групи за адресою
app.get("/api/yasno/group", async (req, res) => {
  const { regionId, streetId, houseId, dsoId } = req.query;
  try {
    const url = `https://app.yasno.ua/api/blackout-service/public/shutdowns/addresses/v2/group?regionId=${regionId}&streetId=${streetId}&houseId=${houseId}&dsoId=${dsoId}`;
    console.log("Yasno group URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Помилка Yasno group:", error);
    res.status(500).json({ error: "Не вдалося визначити групу" });
  }
});

// ============================================
// OE_OUTAGE_DATA (Полтава)
// ============================================
app.get("/api/oe/:fileName", async (req, res) => {
  const { fileName } = req.params;
  try {
    const url = `https://raw.githubusercontent.com/yaroslav2901/OE_OUTAGE_DATA/main/data/${fileName}.json`;
    console.log("OE data URL:", url);
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Помилка ${response.status}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Помилка OE data:", error);
    res.status(500).json({ error: "Не вдалося отримати дані" });
  }
});

app.listen(PORT, () => {
  console.log(`Проксі-сервер запущено на http://localhost:${PORT}`);
});