var express = require('express');
var router = express.Router();
const controller = require("../controllers/cryptos_controller") 

router.post("/" , controller.Initiatecryptos);
router.post("/cryptosinfos" , controller.cryptos);
router.post("/cryptosfiltinfos" , controller.cryptosfilt);

module.exports = router;