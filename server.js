// importation package http pour la création du server
const http = require('http');

const app = require('./app');

//fonction normalise le paramètre (transforme en number si en string)
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// le port sur lequel va s'executer le serveur
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

<<<<<<< HEAD
const server = https.createServer(app);
=======
//création du serveur
const server = http.createServer(app);
>>>>>>> lost-branch

// sur l'événement 'error' - fonction de errorHandler 
server.on('error', errorHandler);

// sur l'événement 'listening'
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
