'use strict';

const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const defs = require('./client-gRPC-defs');
const { serveClient } = defs.Yahtzee;

const Authclient = new serveClient('localhost:7070', grpc.credentials.createInsecure());
const Yahtzeeclient = new serveClient('localhost:7072', grpc.credentials.createInsecure());

fileDownload("test8", "./test");

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

// Authclient.verifyPassword({ username: 'DaBest', password: '123123456' }, (err, res) => {
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


function fileDownload(filename = 'Downloaded Foto.jpg', filepath = './Gordon.jpg') {
    var fileName = filename;
    var fileDownload = Authclient.getFile({ fileName: filepath });

    var file;
    var fileSize = 0;
    var chunkSize = 0;
    var downloadedFile = {};
    // var picture = fs.createWriteStream('test.jpg');
    // var fileName = 'test1.jpg';
    var fileExists = fs.existsSync(fileName);

    fs.writeFileSync(fileName, '');
    // const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const bar1 = new cliProgress.SingleBar({
        format: 'CLI Progress |' + colors.cyan('{bar}') + `| {percentage}% || {value}/{total} Chunks || Duration: {duration}s || Speed: {speed}`,
        // barCompleteChar: '\u2588',
        // barIncompleteChar: '\u2591',
        barCompleteChar: '#',
        barIncompleteChar: '_',
        hideCursor: true
    });
    // bar1.start(100, 0);
    bar1.start(100, 0, {
        speed: "N/A",
    });


    fileDownload.on('data', (res) => {
        // console.log(res);
        // file += res.data;
        fs.appendFileSync(fileName, res.data);
        var fileSize = res.fileSize;
        chunkSize += res.chunkSize;
        // bar1.update(chunkSize/fileSize * 100);
        bar1.increment((res.chunkSize/fileSize) * 100);

    });

    fileDownload.on('end', () => {
        bar1.stop();
        console.log('=======================');
        console.log('\nStream ended!');
        var fileStat = fs.statSync(fileName);
        console.log('File size: ' + chunkSize);
        console.log('File size 2: ' + fileStat.size);
        
    }).on('error', (err) => {
        console.error(err);
    });

    process.on('SIGINT', (code) => {
        console.log('\nAbout to exit with code: ' + code);
        fileDownload.cancel();
        
    });
    function getFileSize(fileName)
    {
        fileBytes = fs.statSync(fileName);
        console.log(fileSize, fileBytes.size);
    }
}