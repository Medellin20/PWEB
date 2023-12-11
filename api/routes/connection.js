var express = require('express');
var router = express.Router();
const controller = require("../controllers/connection_controller");

router.post("/register" , controller.register);

router.post("/login" , controller.login);

router.get("/google/login" , controller.googleLogin);

router.get("/google/callback" , controller.googleLoginCallback);

module.exports = router;