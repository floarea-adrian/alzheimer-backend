const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { getListaPacienti  } = require("../controllers/testController");
const {  getUserById } = require('../controllers/userController');
const { protectie } = require('../controllers/authMiddleware');
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const { schimbaParola } = require("../controllers/userController");
const {
  adaugaPacientLaMedic,
  eliminaPacientDeLaMedic,
} = require("../controllers/userController");



// Ruta care răspunde la GET /api/users
const { verifyToken, allowRoles } = require('../controllers/authMiddleware');

//avatar////////

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `avatar_${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });
const pool = require("../db/connection"); // ajustează calea dacă ai un alt nume



router.get('/', verifyToken, allowRoles('medic'), userController.getAllUsers);

module.exports = router;


router.post('/', userController.registerUser);
router.post('/login', loginUser);
router.post('/register',userController.registerUser);
router.post('/pacient/test', verifyToken, allowRoles('pacient'),  userController.loginUser);
router.post('/medic/test', verifyToken, allowRoles('medic'),  userController.loginUser);
router.get('/pacienti', verifyToken, allowRoles('medic'), userController.getPacienti);
router.get("/profil", protectie, getUserProfile);
router.put("/profil", protectie, updateUserProfile);
router.get('/:id', protectie, getUserById);
router.put("/parola", protectie, userController.schimbaParola);
// Asociază un pacient nou pe baza emailului
router.post("/adauga-pacient", protectie, adaugaPacientLaMedic);

// Elimină un pacient asociat medicului curent
router.delete("/sterge-pacient/:id", protectie, eliminaPacientDeLaMedic);

// router.get("/pacienti", protectie, getListaPacienti);

/////avatar ////
router.put(
  "/avatar",
  protectie,
  upload.single("avatar"),
  async (req, res) => {
    const userId = req.utilizator.id;
    if (!req.file) {
        return res.status(400).json({ message: "Fișier lipsă." });
        }
    const filePath = `/uploads/${req.file.filename}`;

    try {
      await pool.query(
        "UPDATE utilizatori SET avatar = $1 WHERE id_utilizator = $2",
        [filePath, userId]
      );
      res.json({ message: "Avatar actualizat.", avatar: filePath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Eroare la salvarea avatarului." });
    }
  }
);

