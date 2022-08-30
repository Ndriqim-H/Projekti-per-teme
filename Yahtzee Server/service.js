'use-strict';

const grpc = require('@grpc/grpc-js');
const defs = require('./YahtzeeServer-gRPC-defs');
const { YahtzeeService } = defs.Yahtzee;

class Service {
  dbServer = new YahtzeeService('localhost:7071', grpc.credentials.createInsecure());
  
  clientGetScore(call, cb) {
    let user = call.request;

    this.getScore(user.username, (res, err) => {
      if (err) {
        console.error(err);
        user.username = 'And error occurred!';
      } else {
        user = res;
      }
      console.log(user);
      cb(null, user);
    });
  }

  clientSetLastScore(call, cb) {
    let user = call.request;
    console.log(user);
    this.setLastScore(user.username, user.lastScore, (res, err) => {
      if (err) {
        console.error(err);
        user.username = 'And error occurred!';
      } else {
        user = res;
      }
      cb(null, user);
    });
  }
  /**
   *
   * @param {String} username
   */
  getScore(username, callback) {
    
    this.dbServer.getScore({ username: username }, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        callback(res);
      }
    });
  }
  /**
   *
   * @param {String} username
   * @param {number} lastScore
   * @param {null} callback
   */
  setLastScore(username, lastScore, callback) {
    
    this.dbServer.setLastScore({ username: username, lastScore: lastScore }, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        callback(res);
      }
    });
  }
}

module.exports = Service;
