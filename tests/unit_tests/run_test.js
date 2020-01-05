var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var db_test = require('./db_test')

const run_test = async () => {
    // Run all unit tests.

    // Run db_test.
    let promise = db_test.db_test(io)
    let db_test_result = await Promise.resolve(promise)

    if (db_test_result === 'Fail') {
        console.log('Test: FAIL')
    } else {
        console.log('Test: PASS')
    }
    return process.exit()
}

run_test()