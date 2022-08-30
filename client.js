'use strict';

const grpc = require('@grpc/grpc-js');
const defs = require('./client-gRPC-defs');
const { serveClient } = defs.Yahtzee;

const Authclient = new serveClient('localhost:7070', grpc.credentials.createInsecure());
const Yahtzeeclient = new serveClient('localhost:7072', grpc.credentials.createInsecure());

Yahtzeeclient.getScore({ username: 'DaBest' }, (err, res) => {
    if(err)
    {
        console.error(err);
    }
    else{
        var test = {name: 'DaBest', lastName: "Hernandez"};
        if(!res.exists)
        {
            console.log('Given user does not exist!');
        }
        else{
            console.log(res);
        }
    }
});

Authclient.verifyPassword({ username: 'DaBest', password: '123123456' }, (err, res) => {
    if(err){
        console.error(err);
    }
    else{
        console.log(res);
        if(res.valid)
        {
            console.log('Valid password!');
        }
        else{
            console.log('Invalid password!');
        }
    }
});
// Yahtzeeclient.getScore({ username: 'DaBest' }, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     // console.log(res);
//     if (!res.exists) console.log('Given user does not exist!');
//     else {
//       delete res.exists;
//       console.log(res);
//     }
//   }
// });

// Yahtzeeclient.setLastScore({ username: 'DaBest19', lastScore: 187 }, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     // console.log(res);
//     if (!res.exists) console.log('Given user does not exist!');
//     else {
//       delete res.exists;
//       console.log(res);
//     }
//   }
// });

// Authclient.verifyPassword({ username: 'DaBest', password: 'Ndriqa159' }, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     // console.log(res);
//     if (!res.exists) console.log('Given user does not exist!');
//     else {
//       //   delete res.exists;
//       console.log(res);
//     }
//   }
// });

// Authclient.setPassword(
//   { username: 'DaBest', password: '123456789', newPassword: 'Ndriqa159' },
//   (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       // console.log(res);
//       if (!res.exists) console.log('Given user does not exist!');
//       else {
//         //   delete res.exists;
//         console.log(res);
//       }
//     }
//   }
// );

// Authclient.createUser(
//   {
//     username: 'DaBest19',
//     password: '55855',
//     lastScore: 0,
//     highScore: 0,
//     name: 'Ndriqim',
//     lastName: 'Halili',
//     email: 'ndri',
//   },
//   (err, res) => {
//     if (err) console.error(err);
//     if (res.exists) console.error('USER_ALREADY_EXISTS');
//     else {
//       console.log(res);
//     }
//   }
// );
