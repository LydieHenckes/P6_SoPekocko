const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://user:userkocko@cluster0.fydo8.mongodb.net/sopekocko?retryWrites=true&w=majority',
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

app.use(bodyParser.json());

//app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;