'use strict';

// const authService = require('./AutheServer-services');

const Service = require('./service');
const grpc = require('@grpc/grpc-js');
const defs = require('./YahtzeeServer-gRPC-defs');

module.exports = function (){
  const { serveClient } = defs.Yahtzee;

  // const YahtzeeServiceImplementation = require('./service');

  // const service = new YahtzeeServiceImplementation();

  const service = new Service();
  const server = new grpc.Server();

  server.addService(serveClient.service, {
    getScore: service.clientGetScore.bind(service),
    setLastScore: service.clientSetLastScore.bind(service),
  });

  server.bindAsync('0.0.0.0:7072', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }

    console.log('Yahtzee Server started listening on port: ' + port);
    server.start();
  });

}

// service.setLastScore('DaBest', 158, (response) => {
//   if (!response.exists) console.error('USER_DOES_NOT_EXIST');
//   else {
//     console.log(response);
//   }
//   service.getScore('DaBest', (response) => {
//     console.log(response);
//   });
// });

// const serv = new authService();

// client.getScore({ username: 'DaBest' }, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     if (!res.exists) console.log('Given user does not exist!');
//     else {
//       delete res.exists;
//       console.log(res);
//     }
//   }
// });
