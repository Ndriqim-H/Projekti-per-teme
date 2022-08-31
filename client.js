'use strict';

const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const defs = require('./client-gRPC-defs');
const { serveClient } = defs.Yahtzee;

const Authclient = new serveClient('localhost:7070', grpc.credentials.createInsecure());
const Yahtzeeclient = new serveClient('localhost:7072', grpc.credentials.createInsecure());

// Yahtzeeclient.getScore({ username: 'DaBest' }, (err, res) => {
//     if(err)
//     {
//         console.error(err);
//     }
//     else{
//         var test = {name: 'DaBest', lastName: "Hernandez"};
//         if(!res.exists)
//         {
//             console.log('Given user does not exist!');
//         }
//         else{
//             console.log(res);
//         }
//     }
// });

// Authclient.verifyPassword({ username: 'DaBest', password: '123123456' }, (err, res) => {
//     if(err){
//         console.error(err);
//     }
//     else{
//         console.log(res);
//         if(res.valid)
//         {
//             console.log('Valid password!');
//         }
//         else{
//             console.log('Invalid password!');
//         }
//     }
// });

// var call = Authclient.getAllUsersStream({}, (err, res) => {
//     if(err)
//     {
//         console.error(err);
//     }
//     else{
//         console.log(res);
//     }
// });

// call.on('data', (res) => {
//     console.log(res);
// });

// call.on('end', () => {
//     console.log('Stream ended!');
// });

var fileDownload = Authclient.getFile({ fileName: 'Gordon.jpg' }, (err, res) => {
    if(err)
    {
        console.error(err);
    }
    else{
        console.log(res);
    }
});

var file;
var fileSize = 0;
var downloadedFile = {};
// var picture = fs.createWriteStream('test.jpg');

fileDownload.on('data', (res) => {
    // console.log(res);
    // file += res.data;
    
    fileSize += res.fileSize;
    
});


fileDownload.on('end', () => {
    console.log('Stream ended!');
    console.log({
        // file: file,
        fileSize: fileSize
    });
    fs.writeFileSync('test.jpg', file);
});


// Authclient.getAllUsers({},(err,res)=>{
//     if(err)
//     {
//         console.error(err);
//     }
//     else{
//         console.log(res);
//     }
// })

// Authclient.getFile({fileName: "test.txt"}, (err, res) => {
//     if(err)
//     {
//         console.error(err);
//     }
//     else{
//         console.log(res.message);
//     }

// });

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
