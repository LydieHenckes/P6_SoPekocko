/* Middleware de téléchargement d'image*/

const multer = require('multer');
const path = require('path');

// dictionnaire des extentions
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// objet de configuration pour multer
const storage = multer.diskStorage({
  // où seront enrégistrés les fichiers
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // création du nom du fichier unique (récurération d'ancien nom sans extention)
  filename: (req, file, callback) => {
    const name =  path.parse(file.originalname).name.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// exportation de module avec précition qu'on sauvegarde un fichier unique
module.exports = multer({storage: storage}).single('image');