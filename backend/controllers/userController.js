const pool = require("../db/connection");
require("dotenv").config();

// Funcție care returnează toți utilizatorii din baza de date
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM utilizatori");
    res.json(result.rows); // trimitem datele ca JSON
  } catch (err) {
    console.error("Eroare la interogare:", err);
    res.status(500).json({ message: "Eroare la server" });
  }
};

module.exports = {
  getAllUsers,
};

const bcrypt = require("bcrypt");

// Funcție pentru înregistrarea unui utilizator nou
const registerUser = async (req, res) => {
  const { nume, prenume, email, parola, rol } = req.body;

  // 1. Validăm câmpurile
  if (!nume || !email || !parola || !rol) {
    return res
      .status(400)
      .json({ message: "Toate câmpurile sunt obligatorii." });
  }

  try {
    // 2. Verificăm dacă emailul există deja
    const checkUser = await pool.query(
      "SELECT * FROM utilizatori WHERE email = $1",
      [email]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Emailul este deja folosit." });
    }

    // 3. Criptăm parola
    const hashedPassword = await bcrypt.hash(parola, 10); // 10 = nivel de securitate

    // 4. Inserăm utilizatorul în baza de date
    const result = await pool.query(
      "INSERT INTO utilizatori (nume, prenume, email, parola, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nume, prenume, email, hashedPassword, rol]
    );

    res.status(201).json({
      message: "Utilizator înregistrat cu succes.",
      utilizator: result.rows[0],
    });
  } catch (err) {
    console.error("Eroare la înregistrare:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
};

//////////////////LOGIN////////////////////
// Funcție pentru autentificarea unui utilizator

const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, parola } = req.body;

  // 1. Validăm câmpurile
  if (!email || !parola) {
    return res.status(400).json({ message: "Email și parolă obligatorii." });
  }

  try {
    // 2. Căutăm utilizatorul în baza de date după email
    const result = await pool.query(
      "SELECT * FROM utilizatori WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Email sau parolă incorecte." });
    }

    const utilizator = result.rows[0];

    // 3. Verificăm dacă parola introdusă corespunde cu cea din DB
    const match = await bcrypt.compare(parola, utilizator.parola);
    if (!match) {
      return res.status(400).json({ message: "Email sau parolă incorecte." });
    }

    // 4. Generăm token JWT
    const token = jwt.sign(
      {
        id: utilizator.id_utilizator,
        email: utilizator.email,
        rol: utilizator.rol,
      },
      // secretul pentru criptare (este in fisierul .env)
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // tokenul expiră în 1 oră
    );

    // 5. Returnăm token-ul
    res.json({
  message: "Autentificare reușită.",
  token,
  utilizator: {
    id: utilizator.id_utilizator,
    nume: utilizator.nume,
    prenume: utilizator.prenume,
    rol: utilizator.rol,
    avatar: utilizator.avatar || null,
  }
});
  } catch (err) {
    console.error("Eroare la login:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};


///////////medic-pacienti////////////////////

const getPacienti = async (req, res) => {
  const id_medic = req.utilizator.id;

  try {
    const result = await pool.query(
      `
        SELECT u.id_utilizator, u.nume, u.prenume, u.email, u.avatar
        FROM utilizatori u
        INNER JOIN medici_pacienti mp ON mp.id_pacient = u.id_utilizator
        WHERE mp.id_medic = $1
        `,
      [id_medic]
    );

    res.json({ pacienti: result.rows });
  } catch (err) {
    console.error("Eroare la extragerea pacienților:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};



const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "SELECT id_utilizator, nume, prenume FROM utilizatori WHERE id_utilizator = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Eroare la extragerea utilizatorului:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};

// GET: Profilul utilizatorului curent
const getUserProfile = async (req, res) => {
  const userId = req.utilizator?.id;

  try {
    const result = await pool.query(
      "SELECT id_utilizator, nume, prenume, email, cnp, varsta, sex, adresa, apartinator, rol, boli_cronice, studii, avatar FROM utilizatori WHERE id_utilizator = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Eroare profil:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};

// PUT: Actualizează profilul utilizatorului curent
const updateUserProfile = async (req, res) => {
  const userId = req.utilizator?.id;
  const { nume, prenume, cnp, varsta, sex, adresa, apartinator, boli_cronice, studii } = req.body;

  try {
    const result = await pool.query(
      `UPDATE utilizatori
       SET nume = $1, prenume = $2, cnp = $3, varsta = $4, sex = $5, adresa = $6, apartinator = $7, boli_cronice = $8, studii = $9
       WHERE id_utilizator = $10
       RETURNING id_utilizator, nume, prenume, email, cnp, varsta, sex, adresa, apartinator, rol, boli_cronice, studii`,
      [nume, prenume, cnp, varsta, sex, adresa, apartinator, boli_cronice, studii, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Eroare actualizare profil:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};

//schimbare parola

const schimbaParola = async (req, res) => {
  const userId = req.utilizator.id;
  const { actuala, noua } = req.body;

  try {
    const rezultat = await pool.query(
      "SELECT parola FROM utilizatori WHERE id_utilizator = $1",
      [userId]
    );

    if (rezultat.rows.length === 0) {
      return res.status(404).json({ message: "Utilizator inexistent." });
    }

    const parolaCorecta = await bcrypt.compare(actuala, rezultat.rows[0].parola);
    if (!parolaCorecta) {
      return res.status(401).json({ message: "Parola actuală este greșită." });
    }

    const parolaNouaHash = await bcrypt.hash(noua, 10);
    await pool.query(
      "UPDATE utilizatori SET parola = $1 WHERE id_utilizator = $2",
      [parolaNouaHash, userId]
    );

    res.json({ message: "Parola a fost actualizată cu succes." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la actualizarea parolei." });
  }
};


/// adaugare pacienti la medic 
const adaugaPacientLaMedic = async (req, res) => {
  const medicId = req.utilizator.id;
  const { email } = req.body;

  try {
    // Căutăm pacientul după email
    const rezultat = await pool.query(
      "SELECT id_utilizator FROM utilizatori WHERE email = $1 AND rol = 'pacient'",
      [email]
    );

    if (rezultat.rows.length === 0) {
      return res.status(404).json({ message: "Pacientul nu există." });
    }

    const pacientId = rezultat.rows[0].id_utilizator;

    // Verificăm dacă sunt deja asociați
    const verificare = await pool.query(
      "SELECT * FROM medici_pacienti WHERE id_medic = $1 AND id_pacient = $2",
      [medicId, pacientId]
    );

    if (verificare.rows.length > 0) {
      return res.status(400).json({ message: "Pacientul este deja asociat." });
    }

    // Inserăm asocierea
    await pool.query(
      "INSERT INTO medici_pacienti (id_medic, id_pacient) VALUES ($1, $2)",
      [medicId, pacientId]
    );

    res.json({ message: "Pacient asociat cu succes." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la asocierea pacientului." });
  }
};

/// sterge pacient la medic 

const eliminaPacientDeLaMedic = async (req, res) => {
  const medicId = req.utilizator.id;
  const pacientId = req.params.id;

  try {
    const rezultat = await pool.query(
      "DELETE FROM medici_pacienti WHERE id_medic = $1 AND id_pacient = $2",
      [medicId, pacientId]
    );

    res.json({ message: "Pacient eliminat." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la eliminarea pacientului." });
  }
};



module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  getPacienti,
  getUserById,
  getUserProfile,
  updateUserProfile,
  schimbaParola,
  adaugaPacientLaMedic,
  eliminaPacientDeLaMedic
};
