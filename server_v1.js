    // Fetch prices of BTC-USD from 8 platforms and sort them.

var path = require('path');
var request = require("request");
// var mongo = require('mongodb');
var Promise = require('promise');



var api = require('./binance_api.js');
const https = require('https');
const CoinbasePro = require('coinbase-pro');
const publicClient = new CoinbasePro.PublicClient();
const kraken = require('node-kraken-api')
const kraken_public = kraken()
const bittrex_api = require('bittrex-api-node');
const bittrex_public = bittrex_api({
  // publicKey: '<api-key>',
  // secretKey: '<api-secret>',
});





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
  if ( a.price > b.price ){
    return -1;
  }
  if ( a.price < b.price ){
    return 1;
  }
  return 0;
}

function compare_ascending( a, b ) {
  if ( a.price < b.price ){
    return -1;
  }
  if ( a.price > b.price ){
    return 1;
  }
  return 0;
}
// ----- ----- END Tools ----- -----



var fetched_data = [
    {platform_name: 'binance', price: 0 },
    {platform_name: 'coinbase', price: 100 },
    {platform_name: 'kraken', price: 20000 },
    {platform_name: 'bittrex', price: 20000 },
    {platform_name: 'exmo', price: 0},
    {platform_name: 'lakebtc', price: 0},
    {platform_name: 'allcoin', price: 0}
];

io.on('connection', function (socket) {

    const binance_api = require('node-binance-api')().options({
        APIKEY: '5voMApdn1jp8AeVRdYazi7SXD32MpZjvwwrE3CGamIch96041K4QOOv0Ln4r1fTI',
        APISECRET: 'cCPQ6aYNCbUA3fmgYolN4FAFEnIJ5eJ4nU6zSOF33WYvAnkFBaZuZlOmNX1FTFPY',
        useServerTime: true // If you get timestamp errors, synchronize to server time at startup
    });

    // Get pair prices from binance.com
    async function binance_test() {
        while(true){
            console.log('here')
            function fetchJSON(request_params) {
                url = request_params.uri
                // console.log(url)
                // console.log(request_params)
                return fetch(url, {method: 'GET', headers: headers, body: data}).then(response => response.json());
            }

            let requests = [binance_request_params];
            let promises = requests.map(request => fetchJSON(request));

            console.log(promises)

            Promise.all(promises).then(responses => console.log(responses));

            await sleep(5000);
        }
    };

    // Get pair prices from binance.com
    function binance(){
        promise = new Promise((resolve, reject) => {
            // *************** USE USD NOT USDT ***********************
            binance_api.prices('BTCUSDT', (error, ticker) => {
                obj_index = fetched_data.findIndex((obj => obj.platform_name == 'binance'));
                // Convert string to float.
                price = parseFloat(ticker.BTCUSDT);
                //Update price in array.
                fetched_data[obj_index].price = price;
            })
        })
    };

    function coinbase() {
        promise = new Promise((resolve, reject) => {
            publicClient
              .getProductOrderBook('BTC-USD')
              .then(data => {
                  obj_index = fetched_data.findIndex((obj => obj.platform_name == 'coinbase'));
                  // The best ask price. The cheapest price that you can buy coin right now.
                  price = data.asks[0][0];
                  // Convert string to float.
                  price = parseFloat(price);
                  //Update price in array.
                  fetched_data[obj_index].price = price;
              })
              .catch(error => console.log(error))
        })
        return promise
    };

    function kraken() {
        promise = new Promise((resolve, reject) => {
            kraken_public
                .call('Depth', { pair: 'XXBTZUSD', count: 1 })
                .then(data => {
                    obj_index = fetched_data.findIndex((obj => obj.platform_name == 'kraken'));
                    // The best ask price. The cheapest price that you can buy coin right now.
                    price = data.XXBTZUSD.asks[0][0];
                    // Convert string to float.
                    price = parseFloat(price);
                    //Update price in array.
                    fetched_data[obj_index].price = price;
                })
                .catch(err => console.error(err))
        })
        return promise
    };

    function bittrex() {
        promise = new Promise((resolve, reject) => {
            bittrex_public.getOrderBook('USD-BTC')
                .then((data) => {
                    obj_index = fetched_data.findIndex((obj => obj.platform_name == 'bittrex'));
                    // The best ask price. The cheapest price that you can buy coin right now.
                    price = data.result.buy[0].Rate;
                    // Convert string to float.
                    price = parseFloat(price);
                    //Update price in array.
                    fetched_data[obj_index].price = price;
                })
                .catch(err => console.log(err))
          })
        return promise
    };

    function exmo() {
        promise = new Promise((resolve, reject) => {
            const url = "https://api.exmo.com/v1/order_book/?pair=BTC_USD";
            var request = https.request(url, function (response) {
                var chunks = [];
                response.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                response.on('end', function () {
                    var result = JSON.parse(chunks.join(''));
                    obj_index = fetched_data.findIndex((obj => obj.platform_name == 'exmo'));
                    // console.log(result.BTC_USD)
                    // The best ask price. The cheapest price that you can buy coin right now.
                    price = result.BTC_USD.ask_top;
                    // Convert string to float.
                    price = parseFloat(price);
                    //Update price in array.
                    fetched_data[obj_index].price = price;
                })
            })
            request.end();
        })
        return promise
    };

    function lakebtc() {
        promise = new Promise((resolve, reject) => {
            const url = "https://api.LakeBTC.com/api_v2/bcorderbook?symbol=btcusd";
            var request = https.request(url, function (response) {
                var chunks = [];
                response.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                response.on('end', function () {
                    var result = JSON.parse(chunks.join(''));
                    obj_index = fetched_data.findIndex((obj => obj.platform_name == 'lakebtc'));
                    // console.log(result.BTC_USD)
                    // The best ask price. The cheapest price that you can buy coin right now.
                    price = result.bids[0][0];
                    // Convert string to float.
                    price = parseFloat(price);
                    //Update price in array.
                    fetched_data[obj_index].price = price;
                })
            })
            request.end();
        })
        return promise
    };

    function allcoin() {
        promise = new Promise((resolve, reject) => {
            const url = "https://www.allcoin.ca/Api_Order/ticker/?symbol=btc2usdt";
            var request = https.request(url, function (response) {
                var chunks = [];
                response.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                response.on('end', function () {
                    var result = JSON.parse(chunks.join(''));
                    obj_index = fetched_data.findIndex((obj => obj.platform_name == 'allcoin'));
                    // console.log(result.BTC_USD)
                    // The best ask price. The cheapest price that you can buy coin right now.
                    price = result.data.sell;
                    // Convert string to float.
                    price = parseFloat(price);
                    //Update price in array.
                    fetched_data[obj_index].price = price;
                })
            })
            request.end();
        })
        return promise
    };

    async function fetch_prices() {
        while(true){
            promise = binance()
            promise_2 = coinbase()
            promise_3 = kraken()
            promise_4 = bittrex()
            promise_5 = exmo()
            promise_6 = lakebtc()
            promise_7 = allcoin()
            Promise.all([promise, promise_2, promise_3, promise_4, promise_5, promise_6, promise_7])
            .then(
                console.log("All APIs called."),
                fetched_data_descending = JSON.parse(JSON.stringify(fetched_data)),
                fetched_data_descending.sort(compare_descending),
                io.emit('data_ascending', { data: fetched_data_descending }),
                fetched_data.sort(compare_descending),
                console.log('data_descending = \n', fetched_data_descending),
                console.log('\n'),
                io.emit('binance_data', { data: fetched_data_descending }),
                // Calculate the min-max of the top platforms.
                min = fetched_data[fetched_data.length - 1].price,
                max = fetched_data[0].price,
                difference = (max - min).toFixed(8),
                difference_percentage = ((difference/max)*100).toFixed(2),
                io.emit('difference', {data: {"difference": difference, "difference_percentage": difference_percentage}})
            )
            .catch(error => console.log(`Error in promises ${error}`))

            await sleep(5000);
        }
    };

    fetch_prices();
});
