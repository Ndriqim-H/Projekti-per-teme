'use strict';

// const grpc = require('grpc');
const grpc = require('@grpc/grpc-js');
const defs = require('./AuthServergRpc-Defs');
const authService = require('./AutheServer-services');

module.exports = function (){
  const { serveClient } = defs.Yahtzee;

  const serv = new authService();
  const server = new grpc.Server();

  server.addService(serveClient.service, {
    verifyPassword: serv.clientVerifyPassword.bind(serv),
    setPassword: serv.clientSetPassword.bind(serv),
    createUser: serv.clientCreateUser.bind(serv),
    getAllUsers: serv.clientGetAllUsers.bind(serv),
    getFile: serv.clientGetFile.bind(serv),
    getAllUsersStream: serv.clientGetAllUsersStream.bind(serv),
  });

  server.bindAsync('0.0.0.0:7070', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }

    console.log('Yahtzee Authentication server started listening on port: ' + port);
    server.start();
  });
}


/*
const salt = Math.random();
serv.createUser(
  {
    username: 'Ndriqim',
    password: serv.getHash('123456789', salt),
    salt: salt,
    lastScore: 0,
    highScore: 0,
  },
  (res) => {
    if (res.exists) console.error('USER_ALREADY_EXISTS');
    else {
      console.log(res);
    }
  }
);

serv.getPassword('Ndriqim', (res) => {
  if (!res.exists) console.error('USER_DOES_NOT_EXIST');
  else {
    console.log(serv.verifyPassword('12345678', res.password, res.salt));
  }
});
// let salt = Math.random().toString();

// serv.setPassword('DaBest', serv.getHash('123456', salt), salt, (res) => {
//   if (!res.exists) console.error('USER_DOES_NOT_EXIST');
//   else {
//     console.log(res);
//   }
// });

// client.getPassword({ username: 'Ndriqa' }, (err, res) => {
//   // console.log(res);
//   if (err) {
//     console.error(err);
//   } else {
//     if (!res.exists) console.log('Given user does not exist!');
//     else {
//       delete res.exists;
//       pass = res;
//       console.log('User: ', res);
//       // serv.getHash('')
//       console.log(serv.verifyPassword('15785', pass.password, pass.salt));
//     }
//   }
// });
*/
