const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { verifyToken, allowRoles } = require('../controllers/authMiddleware');
const { submitTest, getIstoricPacient,salveazaTest, getRaspunsuriTest, getIstoricTeste} = require('../controllers/testController');
const { protectie } = require('../controllers/authMiddleware');
// console.log("💡 Funcție încărcată:", typeof getIstoricPacient);





router.post('/submit', verifyToken, allowRoles('pacient'), testController.submitTest);
router.get("/istoric", protectie, getIstoricTeste); // pentru pacient
router.get("/istoric/:id_pacient", verifyToken, allowRoles('medic'), testController.getIstoricPacient);
router.get("/raspunsuri/:id_test", protectie, getRaspunsuriTest);
router.post("/teste", salveazaTest);
router.get('/ping', (req, res) => {
  res.json({ message: "API-ul este online și funcționează!" });
});



module.exports = router;

