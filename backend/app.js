// Importăm biblioteca express
const express = require('express');
const cors = require('cors');
const fisaRoutes = require("./routes/fisaRoutes");
const testRoutes = require('./routes/testRoutes');
const { verifyToken } = require('./controllers/authMiddleware');

// Creăm aplicația express
const app = express();

// Stabilim portul pe care va rula serverul
const port = 5000;

// Importăm și folosim variabilele din fișierul .env (pentru baza de date, parola etc.)
require('dotenv').config();

// Vom adăuga rutele (temporar e comentat, pentru că încă nu le-am creat)
const userRoutes = require('./routes/userRoutes');
const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.136:3000'];
const chatRoutes = require("./routes/chatRoutes");

// const verificaAutentificare = require('./middleware/verificaAutentificare');
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use("/api/chat", chatRoutes);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Activăm suportul pentru date în format JSON (utile pentru POST și PUT)


// Legăm rutele de o cale (temporar comentat)
app.use('/api/users', userRoutes);

// Pornim serverul
app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`);
});



app.use('/api/teste', testRoutes);
app.use("/api/fisa", fisaRoutes);

//avatar//
app.use("/uploads", express.static("uploads"))

