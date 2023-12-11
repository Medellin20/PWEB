const express = require('express');
const router = express.Router();
const anonym = require("../controllers/anonym_controller")

router.post("/", anonym.AnonymCreate);
router.put("/updatevalues", anonym.updateanonym);
module.exports = router;