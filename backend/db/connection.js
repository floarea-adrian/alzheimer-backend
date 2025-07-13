const { Pool } = require('pg');
require('dotenv').config();

// Creăm un "pool" de conexiuni către baza de date
const pool = new Pool({
  user: process.env.DB_USER,       // utilizatorul postgres
  host: process.env.DB_HOST,       // localhost
  database: process.env.DB_NAME,   // aplicatie_alzheimer
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Exportăm conexiunea pentru a fi folosită în alte fișiere
module.exports = pool;
