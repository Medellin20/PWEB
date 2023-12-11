var express = require('express');
var router = express.Router();
const controller = require("../controllers/articles_controller")

router.get("/" , controller.articles)

module.exports = router;