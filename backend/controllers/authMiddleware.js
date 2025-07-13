const jwt = require('jsonwebtoken');

const protectie = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token lipsă sau invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretul_meu");
    req.utilizator = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid sau expirat." });
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // extrage antetul Authorization
  const token = authHeader && authHeader.split(' ')[1]; // extrage doar token-ul, fără "Bearer"

  if (!token) {
    return res.status(401).json({ message: 'Acces interzis. Token lipsă.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verifică validitatea tokenului
    req.utilizator = decoded; // atașează datele utilizatorului la request
    next(); // continuă către rută
  } catch (err) {
    return res.status(403).json({ message: 'Token invalid sau expirat.' });
  }
};


// module.exports = verifyToken;

const allowRoles = (...roluriPermise) => {
  return (req, res, next) => {
    const rolUtilizator = req.utilizator?.rol;

    if (!roluriPermise.includes(rolUtilizator)) {
      return res.status(403).json({ message: 'Acces interzis: rol insuficient.' });
    }

    next(); // trece mai departe dacă are rol permis
  };
};

module.exports = { verifyToken, allowRoles, protectie };

