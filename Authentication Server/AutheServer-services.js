'use strict';

const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const defs = require('./AuthServergRpc-Defs');
const authService = require('./AutheServer-services');
const { AuthenticateService } = defs.Yahtzee;
const crypto = require('crypto');

class AuthService {
  dbServer = new AuthenticateService('localhost:7071', grpc.credentials.createInsecure());

  clientGetFile(call, cb) {

    var file = __dirname + "\\"+call.request.fileName;
    // fs.readFile(file, 'binary');
    var fileStream = fs.createReadStream(file);
    fileStream.on('data', function(chunk) {
      // console.log('chunk: ' + chunk);
      // console.log('chunk.length: ' + chunk.length);
      call.write({data: chunk, chunkSize: chunk.length, fileSize: fs.statSync(file).size, message: "Successfully retrieved file!"});

      // call.on('cancelled', () => {
      //   console.log('cancelled');
      //   fileStream._destroy();
      //   fileStream = null;
      //   call.end();
      // });
      
      call.on('end', () => {
        console.log('end');
        fileStream._destroy();
        call.end();
      });
      
    });

    fileStream.on('end', function() {
      call.end();
    });
    
    // call.on('cancelled', () => {
    //   console.log('call cancelled');
    //   fileStream._destroy();
    //   call.end();
    // });
    //.on('error', function(err) {
    //   console.log(err);
    //   call.end();
    // }).on('cancelled', function() {
    //   console.log('cancelled');
    //   call.end();
    // });
    
      // if (err) {
      //   console.error(err);
      //   var response = {message: 'An error occurred!'};
      //   cb(null, response);
      // }
      // else
      // {
      //   var response = {data:data, fileSize:data.length, message: 'Successfully retrieved file!'};
      //   cb(null, response);
      // }
    
  }

  clientGetAllUsersStream(call, cb) {
    this.getAllUsers({}, (err, res) => {
      if (err) {
        console.error(err);
        res.message = 'An error occurred!';
      } else {
        res.message = "Successfully retrieved all users!";
      }

      res.users.forEach(element => {
        console.log(element.username);
        call.write({username: element.username});
      });
      call.end();
    });
    
  }



  clientCreateUser(call, cb) {
    let user = call.request;
    console.log(user);
    user.salt = Math.random().toString();
    user.password = this.getHash(user.password, user.salt);
    this.createUser(user, (res, err) => {
      if (err) {
        console.error(err);
        user.username = 'An error occurred!';
      } else {
        if (res.exists) user.exists = true;
        else {
          user.exists = false;
        }
      }
      cb(null, user);
    });
  }

  clientGetAllUsers(call, cb) {
    this.getAllUsers({}, (err, res) => {
      if (err) {
        console.error(err);
        res.message = 'An error occurred!';
      } else {
        res.message = "Successfully retrieved all users!";
      }
      cb(err, res);
    });
  }

  clientVerifyPassword(call, cb) {
    let user = call.request;
    console.log(user);
    this.getPassword(user.username, (res, err) => {
      if (err) {
        console.error(err);
        user.username = 'An error occurred!';
      } else {
        if (!res.exists) user.exists = false;
        else {
          user.exists = true;
          user.valid = this.verifyPassword(user.password, res.password, res.salt);
          delete user.password;
          console.log(user);
        }
      }
      cb(null, user);
    });
  }

  clientSetPassword(call, cb) {
    let user = call.request;
    this.getPassword(user.username, (res, err) => {
      if (err) {
        console.error(err);
        user.username = 'An error occurred!';
      } else {
        if (!res.exists) user.exists = false;
        else {
          console.log(user);
          user.exists = true;
          user.valid = this.verifyPassword(user.password, res.password, res.salt);
          if (!user.valid) delete user.password;
          else {
            const salt = Math.random().toString();
            this.setPassword(
              user.username,
              this.getHash(user.newPassword, salt),
              salt,
              (res, err) => {
                if (err) {
                  console.error(err);
                  user.username = 'An error occurred!';
                } else {
                  console.log(res);
                }
              }
            );
          }
        }
      }
      cb(null, user);
    });
  }

  /**
   *
   * @param {Array<{ username:string,password: string, salt: string,lastScore: number, highScore: number }>} user
   */
  createUser(user, callback) {
    this.dbServer.createUser(user, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        callback(res);
      }
    });
  }
  /**
   *
   * @param {String} password
   * @param {String} salt
   */
  getHash(password, salt) {
    let md5sum = crypto.createHash('md5');

    const pass = password + salt.toString();
    md5sum.update(pass);
    const hash = md5sum.digest('hex');
    return hash;
  }

  getAllUsers(users, callback) {
    this.dbServer.getAllUsers({}, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        // return res;
      }
      callback(err, res);
    });
  }

  /**
   *
   * @param {String} password
   * @param {String} salt
   * @param {String} hash
   */
  verifyPassword(password, hash, salt, cb) {
    const pass = this.getHash(password.toString(), salt.toString());
    return pass === hash;
  }

  getPassword(username, callback) {
    // const client = new AuthenticateService('localhost:7071', grpc.credentials.createInsecure());
    this.dbServer.getPassword({ username: username }, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        callback(res);
      }
    });
  }

  setPassword(username, password, salt, callback) {
    this.dbServer.setPassword({ username: username, password: password, salt: salt }, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        callback(res);
      }
    });
  }
}

module.exports = AuthService;
