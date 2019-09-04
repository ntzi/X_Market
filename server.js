// Fetch prices of BTC-USD from 8 platforms and sort them.

var path = require('path');
var request = require("request");
// var mongo = require('mongodb');
var Promise = require('promise');



var api = require('./binance_api.js');
const https = require('https');

//Including the required files
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const rp = require('request-promise');
var async = require("async");
const fetch = require('node-fetch');
var pr = require('promise');

var tools = require('./tools.js');

//server listening at 127.0.0.1:3000
server.listen(3000);
console.log("Server listening at: 3000");
//Handling the default route
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


// ----- ----- Tools ----- -----
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function compare_descending( a, b ) {
  if ( a.difference > b.difference ){
    return -1;
  }
  if ( a.difference < b.difference ){
    return 1;
  }
  return 0;
}

function compare_ascending( a, b ) {
  if ( a.difference < b.difference ){
    return -1;
  }
  if ( a.difference > b.difference ){
    return 1;
  }
  return 0;
}
// ----- ----- END Tools ----- -----


var lakebtc_prices = {};

var active_users = 0;
io.on('connection', function (socket) {
    active_users++;
    console.log('New client connected...')
    console.log('Active users: %d', active_users);

    socket.on('disconnect', function (socket) {
        active_users--;
        console.log('Client disconnected...')
        console.log('Active users: %d', active_users);
    });
});


const binance_api = require('node-binance-api')().options({
    APIKEY: '5voMApdn1jp8AeVRdYazi7SXD32MpZjvwwrE3CGamIch96041K4QOOv0Ln4r1fTI',
    // APISECRET: 'cCPQ6aYNCbUA3fmgYolN4FAFEnIJ5eJ4nU6zSOF33WYvAnkFBaZuZlOmNX1FTFPY',
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

// Get pair prices from binance.com
function binance(){
    // This new object contains only useful data in the format we want.
    var binance_prices = {};
    var promise = new Promise((resolve, reject) => {
        // *************** USE USD NOT USDT ***********************
        binance_api.prices((error, ticker) => {
            Object.keys(ticker).forEach(function (item) {
                binance_prices[item.toLowerCase()] = ticker[item];
            });
            resolve(binance_prices);
        })
    })
    promise.catch(function(error) {
        console.log(error);
    });

    return promise
};


function lakebtc() {
    var lakebtc_prices = {};
    var promise = new Promise((resolve, reject) => {
        const url = "https://api.LakeBTC.com/api_v2/ticker";
        var request = https.request(url, function (response) {
            var chunks = [];
            response.on("data", function (chunk) {
                chunks.push(chunk);
            });
            response.on('end', function () {
                var result = JSON.parse(chunks.join(''));
                Object.keys(result).forEach(function (item) {
                    lakebtc_prices[item] = result[item].last;
                });
                resolve(lakebtc_prices);
            })
        })
        request.end();
    });
    return promise
};

function fetch_prices() {

    // const result123 = await promise123;
    setTimeout(() => {
        async_fetch();
        async function async_fetch() {
            var run = true
            const promise_binace = binance();
            const promise_lakebtc = lakebtc();
            const [result_binance, result_lakebtc] = await Promise.all([promise_binace, promise_lakebtc]);
            var common_pairs_binance_lakebtc = []
            // Go through all pairs in each platform.
            Object.keys(result_binance).forEach(function (binance_pair) {
                Object.keys(result_lakebtc).forEach(function (lakebtc_pair) {
                    if (binance_pair == lakebtc_pair){
                        let a = parseFloat(result_binance[binance_pair]);
                        let b = parseFloat(result_lakebtc[lakebtc_pair]);
                        let dif = parseFloat(((Math.abs(a - b) / ((a + b) / 2)) * 100).toFixed(2));
                        if (a > b) {
                            let high_platform = 'Binance';
                            let low_platform = 'Lakebtc';
                            common_pairs_binance_lakebtc.push(
                                {
                                    pair: binance_pair,
                                    high: high_platform,
                                    low: low_platform,
                                    difference: dif
                                }
                            )
                        } else {
                            let high_platform = 'Lakebtc'
                            let low_platform = 'Binance';
                            common_pairs_binance_lakebtc.push(
                                {
                                    pair: binance_pair,
                                    high: high_platform,
                                    low: low_platform,
                                    difference: dif
                                }
                            )
                        }
                    }
                });
            });
            common_pairs_binance_lakebtc.sort(compare_descending);

            console.log("All APIs called.")

            io.emit('data_ascending', { data: common_pairs_binance_lakebtc });

            // console.log(result_binance)
            // console.log(result_lakebtc)

            // console.log('\n')
                // .then(
                    //     console.log(lakebtc_prices),
                    //
                    //     // fetched_data_descending = JSON.parse(JSON.stringify(fetched_data)),
                    //     // fetched_data_descending.sort(compare_descending),
                    //     // io.emit('data_ascending', { data: fetched_data_descending }),
                    //     // fetched_data.sort(compare_descending),
                    //     // console.log('data_descending = \n', fetched_data_descending),
                    //     // console.log('\n'),
                    //     // io.emit('binance_data', { data: fetched_data_descending }),
                    //     // // Calculate the min-max of the top platforms.
                    //     // min = fetched_data[fetched_data.length - 1].price,
                    //     // max = fetched_data[0].price,
                    //     // difference = (max - min).toFixed(8),
                    //     // difference_percentage = ((difference/max)*100).toFixed(2),
                    //     // io.emit('difference', {data: {"difference": difference, "difference_percentage": difference_percentage}})
                    // )
                    // .catch(error => console.log(`Error in promises ${error}`))
                    // run = false;
                    // await sleep(2000);
        }
        // Repeat the call.
        fetch_prices();
    }, 5000);
};
// Call once to begin the infinite loop.
fetch_prices();
