// middleware de validation de mot de passe
const passwordValidator = require('password-validator');

// Création d'un schèma
var schema = new passwordValidator();

// Ajout de propriété qui seront vérifiés pour le mot de passe
schema
.is().min(8)                                    // Minimum 8 caractères dans le mot de passe
.has().uppercase()                              // Une lettre majuscule
.has().lowercase()                              // une lettre minuscule
.has().digits()                                // une chiffre
.has().not().spaces()                           // Le mot de passe de doit pas contenir des espaces

module.exports = (req, res, next) => {
	if (!schema.validate(req.body.password)) {
		const mustBeChangeString = schema.validate(req.body.password, { list: true });
		return res.status(400).json( { error: 'Mot de passe doit contenir : ' + mustBeChangeString});
	} else { next() };
};