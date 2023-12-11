const express = require('express');
const router = express.Router();
const auth = require("../utils/auth").auth_jwt
const users = require("../controllers/users_controller")

/* GET users listing. */
router.get("/",  users.userList)

router.get("/user", users.userSelect)

router.post("/addcrypto", users.addCryptoToFavorites)

router.delete("/deletecrypto", users.deleteCryptoFromFavorites)

router.put("/password-update", users.updatePassword)

router.delete("/user/:id", users.userDelete )


module.exports = router;