const pool = require("../db/connection");

const getMesajeChat = async (req, res) => {
  const id_utilizator = parseInt(req.params.id_utilizator);
  const id_curent = req.utilizator.id; // preluat din JWT

  try {
    const result = await pool.query(
      `SELECT * FROM mesaje_chat 
       WHERE (de_la = $1 AND catre = $2) OR (de_la = $2 AND catre = $1)
       ORDER BY timestamp ASC`,
      [id_curent, id_utilizator]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la GET mesaje:", err);
    res.status(500).json({ message: "Eroare la încărcarea mesajelor." });
  }
};

const trimiteMesaj = async (req, res) => {
  const { catre, text } = req.body;
  const de_la = req.utilizator.id;

  if (!catre || !text) {
    return res.status(400).json({ message: "Date incomplete." });
  }

  try {
    await pool.query(
      "INSERT INTO mesaje_chat (de_la, catre, text) VALUES ($1, $2, $3)",
      [de_la, catre, text]
    );
    res.status(201).json({ message: "Mesaj trimis cu succes." });
  } catch (err) {
    console.error("Eroare la POST mesaj:", err);
    res.status(500).json({ message: "Eroare la trimiterea mesajului." });
  }
};

module.exports = { getMesajeChat, trimiteMesaj };
