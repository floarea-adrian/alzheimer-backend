const express = require("express");
const router = express.Router();
const { getMesajeChat, trimiteMesaj } = require("../controllers/chatController");

router.get("/:id_utilizator", getMesajeChat);
router.post("/", trimiteMesaj);

module.exports = router;
