// les routes pour les requêtes sauces

const express = require('express');
// utilisation de la classe express.Router pour créer des gestionnaires de route pour les users
const router = express.Router();

// importation de middleware d'authéntification
const auth = require('../middleware/auth');

// importation de middleware pour les images
const multer = require('../middleware/multer-config');

// logique métier décrite dans controllers/sauces.js
const sauceCtrl = require('../controllers/sauce');

// récupération de la liste des sauces
router.get('/', auth,  sauceCtrl.getAllSauces);

// enrégistrément d'une nouvelle sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// récupération d'une sauce concrete avec certain id
router.get('/:id', auth, sauceCtrl.getOneSauce);

// modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// suppréssion d'une sauce par son id
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// modification d'un like ou d'un dislike
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;