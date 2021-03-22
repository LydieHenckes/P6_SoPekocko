const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// déclaration de l'application express
const app = express();
const path = require('path');

// permet avoir l'accès aux variable dans .env
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

 // bodyparser permet d'analyser le body de la requête comme JSON 
app.use(bodyParser.json());

// définition des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// export de l'application express
module.exports = app;