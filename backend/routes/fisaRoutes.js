const express = require("express");
const router = express.Router();
const { exportaPDF } = require("../controllers/fisaController");

const {
  getFisaMedicala,
  updateFisaMedicala, creeazaFisaMedicala
} = require("../controllers/fisaController");

const { protectie } = require("../controllers/authMiddleware");

router.get("/:id_pacient", protectie, getFisaMedicala);
router.put("/:id_pacient", protectie, updateFisaMedicala);
router.post("/:id_pacient", protectie, creeazaFisaMedicala);
router.get("/exporta-pdf/:id", exportaPDF);


module.exports = router;
