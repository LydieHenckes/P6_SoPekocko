const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//modules pour la sécuruté
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const toobusy = require('toobusy-js');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const session = require('express-session');

// déclaration de l'application express
const app = express();
const path = require('path');

// permet avoir l'accès aux variables dans .env
require('dotenv').config();

// connection à la base de données
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
	useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

// ajout des headers pour permettre le cross origin resource sharing
  app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

// helmet aide à sécuriser les applications Express en définissant divers en-têtes HTTP
app.use(helmet());

// hpp - middleware pour se protéger contre les attaques de pollution des paramètres HTTP
app.use(hpp());

// création du fichier de la journalisation
var accessLogStream = fs.createWriteStream(
	path.join(__dirname, 'access.log'), {flags: 'a'}
);
// journalisation 
app.use(morgan('combined', {stream: accessLogStream}));

// utilisation de toobusy-js : si le serveur est trop occupé, envoie la réponse, sans traîter la requête, car cela peut être une attaque DoS
app.use(function(req, res, next) {
	if (toobusy()) {
		 res.send(503, "Server Too Busy");
	} else {
		next();
	}
});

// utilisation express-rate-limiter
const apiLimiter = rateLimit({
	windowMs: 2*60*1000, // 2 minutes
	max: 10,
	message: 'Vous avez dépassé le nombre de tentations de connecxion, re-essayer plus tard !'
 });
  // on applique uniquement pour les requêtes d'authéntification
 app.use('/api/auth', apiLimiter);


// limitation de taille de la requête 
app.use(express.urlencoded({ limit: "1kb" }));
app.use(express.json({ limit: "1kb" }));

// utilisation d'express-session (contre attaques XSS et CSRF)
app.use(session({
	secret: "KockoPe",
	cookie :{ secure: true, path: "/", httpOnly: true, maxAge: null }
}));

 // bodyparser permet d'analyser le body de la requête comme JSON 
app.use(bodyParser.json());


// express-mongo-sanitize nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB
app.use(mongoSanitize());


// définition des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// export de l'application express
module.exports = app;