'use strict';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/db.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const defs = grpc.loadPackageDefinition(packageDefinition);

module.exports = defs;
