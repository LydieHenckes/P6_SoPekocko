// importtion de mongoose (ODM pour MongoDB)
const mongoose = require('mongoose');

//importation du module pour verifier si un champs est unique
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,
              validate: {
                validator: function (value) {
                  if (value === '') return false;
                  else return true; 
                },
                msg: "Le mot de passe vide ou contenant des caractères intérdits !"
              } }
});

//application de uniqueValidator à la userSchema, qui au moment de sauvegarde vérifiera si le chapms indiqué comme unique est unique 
userSchema.plugin(uniqueValidator);

// export du schema User
module.exports = mongoose.model('User', userSchema);