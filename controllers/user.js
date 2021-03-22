/* Logique métier pour users*/

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/User');

//logique métier pour la route Post /signup (inscription)
exports.signup = (req, res, next) => {
	// contrôle de l'email 
	if (!validator.isEmail(req.body.email)) {
		return res.status(401).json({error: "Email n'est pas valide !"});
	}
	// cryptage du mot de passe
	bcrypt.hash(req.body.password, 10)
	  .then(hash => {
		 const user = new User({
			email: req.body.email,
			password: hash
		 });
		 //sauvegarde de nouveau utilisateur
		 user.save()
			.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
			.catch(error => res.status(400).json({ error }));
	  })
	  .catch(error => res.status(500).json({ error }));
 };

 // logique métier pour la route Post /login (connection)
 exports.login = (req, res, next) => {
	 // recherche d'utilisateur par son email
	User.findOne({ email: req.body.email })
	  .then(user => {
		  // si il n'y a pas d'utilisateur avec cet email
		 if (!user) {
			return res.status(401).json({ error: 'Utilisateur non trouvé !' });
		 }

		 // comparaison des hash de nouveau mot de passe, avec hash du mot de passe dans la base
		 bcrypt.compare(req.body.password, user.password)
			.then(valid => {
			  if (!valid) {
				 return res.status(401).json({ error: 'Mot de passe incorrect !' });
			  }
			  // si les hashs provient du même mot de passe, envoie du userId et token 
			  res.status(200).json({
				 userId: user._id,
				 token: jwt.sign(
					{ userId: user._id },
					'az8K56GTF712dpB',
					{ expiresIn: '24h' }
				 )
			  });
			})
			.catch(error => res.status(500).json({ error }));
	  })
	  .catch(error => res.status(500).json({ error }));
 };