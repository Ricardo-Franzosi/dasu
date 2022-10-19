const router = require('express').Router()
const users = require("../controllers/userCt")

router.get('/login',users.getLoginForm);
router.post('/login',users.sendLoginForm);
router.get('/register',users.getRegisterForm);
router.post('/register',users.sendRegisterForm);
router.get("/logout", users.logout)


module.exports = router