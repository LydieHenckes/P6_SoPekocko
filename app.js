const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//const helmet = require('helmet');
//const rateLimit = require("express-rate-limit");
//const mongoSanitize = require('express-mongo-sanitize');



require('dotenv').config();

mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
	useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

//app.use(helmet());


app.use(bodyParser.json());
//app.use(mongoSanitize());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
console.log('ici');
app.use('/api/auth', userRoutes);

module.exports = app;