'use strict';

const { JSONStorage } = require('node-localstorage');

class DbService {
  constructor() {
    this.storage = new JSONStorage(__dirname + '/db');
  }

  createUser(call, cb) {
    const users = this.getDb();
    const user = call.request;
    // console.log(user);
    if (users.find((u) => u.username === user.username)) user.exists = true;
    else user.exists = false;

    // console.log(user);
    if (!user.exists) {
      delete user.exists;
      user.lastScore = 0;
      user.highScore = 0;
      users.push(user);
      this.storeDb(users);
    }

    cb(null, user);
  }
  /**
   *
   * @param {Array<{username:string, exists:bool}>} call.request
   */
  getUser(call, cb) {
    const users = this.getDb();
    let user = call.request;
    let returnUser = users.find((u) => u.username === user.username);

    if (!returnUser) {
      user.exists = false;
    } else {
      user = returnUser;
      user.exists = true;
    }

    cb(null, user);
    // returnUser = users.find((u) => u.username === user.username);
  }

  getPassword(call, cb) {
    const users = this.getDb();
    let user = call.request;

    let returnUser = users.find((u) => u.username === user.username);
    if (!returnUser) {
      user.exists = false;
    } else {
      user = returnUser;
      user.exists = true;
    }

    cb(null, user);
  }

  getScore(call, cb) {
    const users = this.getDb();
    let user = call.request;

    let returnUser = users.find((u) => u.username === user.username);
    if (!returnUser) {
      user.exists = false;
    } else {
      user = returnUser;
      user.exists = true;
    }

    cb(null, user);
  }

  setLastScore(call, cb) {
    let users = this.getDb();
    let user = call.request;

    let returnUser = users.find((u) => u.username === user.username);
    if (!returnUser) {
      user.exists = false;
      delete user.lastScore;
    } else {
      users = users.filter((u) => u.username !== user.username);
      returnUser.lastScore = user.lastScore;
      if (returnUser.lastScore > returnUser.highScore) returnUser.highScore = returnUser.lastScore;
      users.push(returnUser);
      this.storeDb(users);
      user.exists = true;
      delete user.lastScore;
      // user = returnUser;
    }
    cb(null, user);
  }

  setPassword(call, cb) {
    let users = this.getDb();
    let user = call.request;

    let returnUser = users.find((u) => u.username === user.username);

    if (!returnUser) {
      user.exists = false;
      delete user.password;
      delete user.salt;
    } else {
      users = users.filter((u) => u.username !== user.username);
      returnUser.password = user.password;
      returnUser.salt = user.salt;
      // console.log(returnUser);
      users.push(returnUser);
      this.storeDb(users);
      user.exists = true;
      delete user.password;
      delete user.salt;

      // user = returnUser;
    }
    cb(null, user);
  }

  // listUsers(call) {
  //   this.getDb().forEach((user) => {
  //     call.write(user);
  //   });
  //   call.end();
  // }

  /**
   * @returns {Array<{ username: string, password: string, salt: number, lastScore: number, highScore: number }>}
   */
  getDb() {
    return this.storage.getItem('users') || [];
  }

  // getPassword(call, cb) {
  //   const username = call.request;

  //   const users = this.getDb();
  //   user = users.find((user) => user.username === username);

  //   payload = JSON.stringify({ password: user.password, salt: user.salt });

  //   cb(null, payload);
  // }

  /**
   *
   * @param {Array <{username: string, password: string, salt: number, lastScore: number, highScore: number}>} users
   */
  storeDb(users) {
    return this.storage.setItem('users', users);
  }
}

module.exports = DbService;
