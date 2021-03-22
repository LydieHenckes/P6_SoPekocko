// middleware d'authentification, compare le userId présent dans 
//le token de la requête avec userId de la requête

// module permettant de travailler avec les token d'authéntification
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'az8K56GTF712dpB');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
        return res.status(401).json({error : "Lidentifiant de l'utilisateur n'est pas valable !"});
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error('Invalid request!') });
  }
};