var express = require('express');
//Initialize the express App
var app = express();
var server = require('http').Server(app);
var path = require('path');
// var bodyParser = require('body-parser');
var io = require('socket.io')(server);;
//Twitter
// var Twitter = require('twitter');
var request = require("request");
//MySQL
// var mysql = require('mysql');
//Including the required packages
var mongo = require('mongodb');
var Promise = require('promise');



//starting server at 3000 port
// server.listen(3000);



function coinmarketcap_data(){
    /* Example in Node.js ES6 using request-promise */

    const rp = require('request-promise');
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      qs: {
        'start': '1',
        'limit': '1',
        'convert': 'USD'
      },
      headers: {
        'X-CMC_PRO_API_KEY': 'dae3a817-9c5f-472f-8f26-eeab7cc38669'
      },
      json: true,
      gzip: true
    };

    rp(requestOptions).then(response => {
      console.log('API call response:', response);

      //Establishing the connection
      var new_db = "mongodb://localhost:27017"

      //establishing the connection
      mongo.connect(new_db ,(error , client) => {
          if (error){
              throw error;
          }
          var db = client.db('demo_db')


          db.collection("crypto").insertOne(response, (err , collection) => {
              if(err) throw err;
              console.log("/nRecord inserted successfully");
              // console.log(collection);
          });

          //To close the connection
          client.close();

          return response
      });
    }).catch((err) => {
      console.log('API call error:', err.message);
    });

}


//
// //Establishing the connection
// var new_db = "mongodb://localhost:27017"
//
// //establishing the connection
// mongo.connect(new_db ,(error , client) => {
//   if (error){
//       throw error;
//   }
//   var db = client.db('demo_db')
//
//   // Find all records.
//   db.collection("crypto").find({}).toArray((err , collection) => {
//       if(err) throw err;
//       console.log("Collection: crypto:\n");
//       console.log(collection);
//   });
//
//   // Find one record.
//   db.collection("crypto").find({}, {projection: {_id: 0}}).toArray((err , collection) => {
//       if(err) throw err;
//       console.log("Record:\n");
//       console.log(collection);
//   });
//
//
//   db.listCollections().toArray(function(err, collInfos) {
//       // collInfos is an array of collection info objects that look like:
//       // { name: 'test', options: {} }
//       console.log("All collections:\n" + collInfos)
//   });
//
//   //To close the connection
//   client.close();
// });




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
// //Handling the route for admin
// app.get('/' , function(req,res) {
//     res.sendFile(__dirname + '/index.html');
// })


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


// //Code for sockets
// // Start getting prices once the button is clicked
// io.on('connection', function (socket) {
//
//   socket.emit('welcome', { data: 'welcome' });
//
//   socket.on('get_data', function (socket) {
//       console.log('Button clicked')
//
//       const requestOptions = {
//           method: 'GET',
//           // uri: 'https://api.binance.com/api/v3/ticker/price',
//           uri: 'https://api.binance.com/api/v3/ticker/price',
//           qs: {
//               // 'start': '1',
//               // 'limit': '1',
//               // 'convert': 'USD'
//               symbol: 'BTCUSDT',
//               // limit: '2'
//           },
//           headers: {
//               'X-MBX-APIKEY': '5voMApdn1jp8AeVRdYazi7SXD32MpZjvwwrE3CGamIch96041K4QOOv0Ln4r1fTI '
//               // 'secret-key': 'cCPQ6aYNCbUA3fmgYolN4FAFEnIJ5eJ4nU6zSOF33WYvAnkFBaZuZlOmNX1FTFPY'
//           },
//           json: true,
//           gzip: true
//       };
//
//       // try calling apiMethod 3 times, waiting 200 ms between each retry
//       // async.retry(3, apiMethod, function(err, result) {
//       async function solution() {
//           while(true){
    //               rp(requestOptions).then(response => {
    //                   console.log('API call response:', response);
    //                   var result = response.price;
    //                   console.log(result)
    //
    //                   io.emit('server_data', { data: result });
    //
    //               }).catch((err) => {
    //                   console.log('API call error:', err.message);
    //               });
//               console.log("New price fetched.")
//               await sleep(5000);
//           }
//
//       };
//       solution();
//   });
// });




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

  // socket.emit('welcome', { data: 'welcome' });

    // Request options for binance.com API.
    const binance_request_options = {
        method: 'GET',
        // uri: 'https://api.binance.com/api/v3/ticker/price',
        uri: 'https://api.binance.com/api/v3/ticker/price',
        qs: {
            // 'start': '1',
            // 'limit': '1',
            // 'convert': 'USD'
            symbol: 'BTCUSDT',
            // limit: '2'
        },
        headers: {
            'X-MBX-APIKEY': '5voMApdn1jp8AeVRdYazi7SXD32MpZjvwwrE3CGamIch96041K4QOOv0Ln4r1fTI '
            // 'secret-key': 'cCPQ6aYNCbUA3fmgYolN4FAFEnIJ5eJ4nU6zSOF33WYvAnkFBaZuZlOmNX1FTFPY'
        },
            json: true,
            gzip: true
    };

    var headers = {
      // "Content-Type": "application/json",
      'X-MBX-APIKEY': '5voMApdn1jp8AeVRdYazi7SXD32MpZjvwwrE3CGamIch96041K4QOOv0Ln4r1fTI '
    }

    var data = {
        'symbol': 'BTCUSDT',
        'json': 'true'
    }

    // let query = Object.keys(params)
                 // .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                 // .join('&');

    // let url = 'https://api.binance.com/api/v3/ticker/price?' + query
    // console.log(url)

    // fetched_data = fetched_data.sort( tools.compare );
    // console.log(fetched_data)

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

            //
            // rp(binance_request_options).then(response => {
            //     console.log('API call response:', response);
            //     //Find index of specific object using findIndex method.
            //     obj_index = fetched_data.findIndex((obj => obj.platform_name == 'binance'));
            //     //Update price in array.
            //     fetched_data[obj_index].price= response.price;
            //
            //     fetched_data.sort( compare );
            //
            //     io.emit('binance_data', { data: fetched_data });
            // }).catch((err) => {
            //     console.log('API call error:', err.message);
            // });
            // console.log("New price fetched.")
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
                // console.log('fetched_data \n', fetched_data),
                fetched_data.sort(compare_ascending),
                // console.log('fetched_data_ascending = \n', fetched_data),
                io.emit('data_ascending', { data: fetched_data }),
                fetched_data.sort(compare_descending),
                console.log('data_descending = \n', fetched_data),
                console.log('\n'),
                io.emit('binance_data', { data: fetched_data }),
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
