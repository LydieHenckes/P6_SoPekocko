/* Les routes pour les requêtes users*/

const express = require('express');
const validatePassword = require('../middleware/validatePassword');
// utilisation de la classe express.Router pour créer des gestionnaires de route pour les users
const router = express.Router();

// la logique métier décrite dans controllers/user.js
const userCtrl = require('../controllers/user');

// inscription
router.post('/signup', validatePassword, userCtrl.signup);

//connection
router.post('/login', userCtrl.login);

module.exports = router;