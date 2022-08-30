var dbStart = require('../Db Server/Dbserver.js');
var yahtzeeStart = require('../Yahtzee Server/YahtzeeServer.js');
var authStart = require('../Authentication Server/Authserver.js');

authStart();
dbStart();
yahtzeeStart();
