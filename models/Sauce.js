// importtion de mongoose (ODM pour MongoDB)
const mongoose = require('mongoose');

// création de schema pour la ressource Sauce
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type:  [String], required: false },
});

//export de schema 
module.exports = mongoose.model('Sauce', sauceSchema);