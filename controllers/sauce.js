/* Logique métier pour sauces*/

const Sauce = require('../models/sauce');

// API fs permet les opérations traditionnelles sue les fichiers
const fs = require('fs');

// enrégistrement d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    // url où se trouve le fichier récupéré par multer
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

// l'information d'une sauce concrète récupérée par son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {res.status(200).json(sauce);})
  .catch((error) => {res.status(404).json({error});});
};

// modification d'une sauce 
exports.modifySauce = (req, res, next) => {
  // avec opétateur ternaire on verifie si il y a req.file - donc il y a une nouvelle image
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//suppression d'une sauce par son id
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => { res.status(200).json(sauces); })
  .catch( (error) =>  res.status(400).json({  error: error }));
};

// fonction de modification des likes et dislikes
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    // like
    case 1: 
      Sauce.updateOne({_id: req.params.id}, {
        _id: req.params.id,
        $inc: {likes: 1},
        $push: {usersLiked: req.body.userId},
      })
      .then(() => res.status(201).json({message: "Like enregistré !"}))
      .catch(error => res.status(400).json({error}));
      break;

    // dislike
    case -1:
      Sauce.updateOne({_id: req.params.id}, {
        _id: req.params.id,
        $inc: {dislikes: 1},
        $push: {usersDisliked: req.body.userId},
      })
       .then(() => res.status(201).json({message: "Dislike enregistré !"}))
       .catch(error => res.status(400).json({error}));
      break;

    // modification
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          // cet utilisateur est dans l'array des usersLiked
          if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
            Sauce.updateOne({_id: req.params.id}, {
              _id: req.params.id,
              $inc: {likes: -1},
              $pull: {usersLiked: req.body.userId},
            })
             .then(() => res.status(201).json({message: "Like supprimé !"}))
             .catch(error => res.status(400).json({error}));
            
          }else {
            // cet utilisateur est dans l'array des usersDisliked
            if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                  Sauce.updateOne({_id: req.params.id}, {
                    _id: req.params.id,
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked: req.body.userId},
                  })
                  .then(() => res.status(201).json({message: "Dislike supprimé !"}))
                  .catch(error => res.status(400).json({error}));
                }; 
           }
        })
        .catch(error => res.status(500).json({error}));
      break;
    default :
      throw error;  
  };
};