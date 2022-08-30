'use strict';

const grpc = require('@grpc/grpc-js');
const defs = require('./grpc-defs');
// console.log(defs);
module.exports = function (){
  const { YahtzeeService, AuthenticateService } = defs.Yahtzee;
  // const {YahtzeeService}

  // console.log(Yahtzee);

  const YahtzeeServiceImplementation = require('./service');

  const service = new YahtzeeServiceImplementation();
  const server = new grpc.Server();

  server.addService(AuthenticateService.service, {
    // createBook: service.createBook.bind(service),
    // listBooks: service.listBooks.bind(service),
    getPassword: service.getPassword.bind(service),
    setPassword: service.setPassword.bind(service),
    createUser: service.createUser.bind(service),
    getUser: service.getUser.bind(service),
  });

  server.addService(YahtzeeService.service, {
    getScore: service.getScore.bind(service),
    setLastScore: service.setLastScore.bind(service),
  });

  server.bindAsync('0.0.0.0:7071', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }

    console.log('Yahtzee Database server started listening on port ' + port);
    server.start();
  });
}