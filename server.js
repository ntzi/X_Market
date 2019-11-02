
// var mongo = require('mongodb');
var Promise = require('promise');
const https = require('https');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var async = require("async");
var os = require( 'os' );
var mongoose = require('mongoose');
const CoinbasePro = require('coinbase-pro');
const publicClient = new CoinbasePro.PublicClient();
// var tools = require('./tools.js');

// Custom files.
var database = require('./db')


app.set('view engine', 'ejs')

// 'process.env.PORT' will set the port using Heroku, else use the port 3000.
// Heroku on local execution ($ heroku local) uses the port 5000.
// Heroku on cloud execution ($ heroku open) changes the port dynamically.
// Node on local execution ($ node server.js) uses port 3000.
const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))
// Ports 3000 and 5000 are used (most of the time) on local runs.
if (PORT == '3000'|| PORT == '5000') {
    address = 'http://localhost:'+PORT
} else {
    address = 'https://x-market-mvp.herokuapp.com/';
}

// Send the address of the server to the client in order to set up connection.
app.get('/', (req, res) =>
    res.render('pages/index', {address:address})
)
// Use this to provide access to 'public' folder from html.
app.use(express.static(__dirname + '/public'))




//-----------------------------------------
// Mongoose Schema Initialization
//-----------------------------------------
var data_schema = new mongoose.Schema({
    _time: Number,
    _data:[{
        pair: String,
        high: String,
        low: String,
        difference: Number
    }]
});
var Data = mongoose.model('Data', data_schema);


// Remodel the database shape.
var data_schema_new = new mongoose.Schema({
    pair: String,
    platform_1: String,
    platform_2: String,
    data:[{
        time: Number,
        difference: Number
    }]
});

var Data_new = mongoose.model('Data', data_schema);

//-----------------------------------------
// Tools
//-----------------------------------------

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



var lakebtc_prices = {};



const send_data = async(io) => {
    // Get all needed data from database and push them to client.

    let promise = database.send_data(io)
    await Promise.resolve(promise)
}

const save_data = async (input) => {
    // Save new data to database.

    let promise = database.save_data(input)
    await Promise.resolve(promise)

}













// -----------------------------------------
// Manage client connection/disconnection.
// -----------------------------------------
var active_users = 0;
io.on('connection', function (socket) {
    active_users++;
    console.log('New client connected...')
    console.log('Active users: %d', active_users);



    // Send data from database to newly connected client.
    send_data(io)

    input = [
        { pair: 'xrpbtc',
        platform_name_1: 'Coinbase',
        platform_name_2: 'Binance',
        time: Date.now(),
        difference: 20.45
        },
      { pair: 'xrpbtc',
        platform_name_1: 'Lakebtc',
        platform_name_2: 'Binance',
        time: Date.now(),
        difference: 31.43
        },
      { pair: 'ltcbtc',
        platform_name_1: 'Lakebtc',
        platform_name_2: 'Binance',
        time: Date.now(),
        difference: 16.4
        },
        { pair: 'btceth',
          platform_name_1: 'Binance',
          platform_name_2: 'Coinbase',
          time: Date.now(),
          difference: 29.1
      }
    ]

    // Save data to database.
    // save_data(input)




    // Close connection
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
    // Get the price of all pairs from binance.
    var binance_prices = {};
    var promise = new Promise((resolve, reject) => {
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
    // Get the price of all pairs from lakebtc.
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

// Unused
function get_coinbase_pairs() {
    // Get the all coins pairs from Coinbase.
    var coinbase_pairs = [];
    promise = new Promise((resolve, reject) => {
        publicClient
          .getProducts()
          .then(data => {
              // Gather all pairs of Coinbase in an array.
              Object.keys(data).forEach(function (index) {
                  coinbase_pairs.push(data[index].id)
              })
              resolve(coinbase_pairs)
          })
          .catch(error => console.log(error))
    })
    return promise
};

function coinbase_single_pair(pair) {
    // Get the price of all pairs from coinbase.
    // pairs = ['BTC-USD', 'ETH-USD'];
    // pair = 'BTC-USD';
    var pairs_obj = {}

    promise = new Promise((resolve, reject) => {
        publicClient
          .getProductTicker(pair)
          .then(data => {
              resolve(data.price)
          })
          .catch(error => console.log(error))
    })
    return promise
}

function coinbase(){
    promise = new Promise((resolve, reject) => {

        const start = async () => {
            // Split the pairs of Binance in packs of 6 items because more than 6 items can't be called in a (burst) API
            // call.
            var coinbase_pairs_pack = [
                [
                'ETH-GBP',
                'XLM-EUR',
                'XLM-BTC',
                'XTZ-BTC',
                'ETC-EUR',
                'BTC-USD',
            ],
            [
                'LINK-ETH',
                'LINK-USD',
                'ETC-BTC',
                'ETH-EUR',
                'XRP-USD',
                'ETH-USDC'
            ],
            [
                'ETC-GBP',
                'ETH-USD',
                'DAI-USDC',
                'LOOM-USDC',
                'XRP-EUR',
                'BTC-GBP'
            ],
            [
                'ZRX-BTC',
                'BTC-EUR',
                'XLM-USD',
                'EOS-BTC',
                'BTC-USDC',
                'BCH-BTC'
            ],
            [
                'ALGO-USD',
                'LTC-GBP',
                'BAT-USDC',
                'BCH-GBP',
                'LTC-USD',
                'ZEC-BTC',
            ],
            [
                'MANA-USDC',
                'DNT-USDC',
                'ZRX-EUR',
                'GNT-USDC',
                'ETC-USD',
                'EOS-EUR',
            ],
            [
                'BCH-EUR',
                'XRP-BTC',
                'LTC-BTC',
                'ZEC-USDC',
                'EOS-USD',
                'BCH-USD'
            ],
            [
                'ETH-DAI',
                'CVC-USDC',
                'ETH-BTC',
                'BAT-ETH',
                'LTC-EUR',
                'REP-USD',
            ],
            [
                'XTZ-USD',
                'REP-BTC',
                'ZRX-USD'
            ]]

            var promises = [];
            var prices = {};
            for (coinbase_pairs of coinbase_pairs_pack) {
                promises.push(coinbase_pairs.map(async (pair, idx) => {
                    // console.log(`Received Todo ${idx+1+round}:`, await coinbase_single_pair(pair))
                    // prices.push(await coinbase_single_pair(pair));

                    // Edit pair name from 'BTC-USD' to 'btcusd'
                    let pair_full = pair.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
                    prices[pair_full] = await coinbase_single_pair(pair);
                }));
                await sleep(2000);
            }
            resolve(prices);
        }
        start()
    });
    return promise
}

const init = async() => {
    const promise_coinbase_pairs = get_coinbase_pairs();
    const [coinbase_pairs] = await Promise.all([promise_coinbase_pairs]);
    return coinbase_pairs
}


function fetch_prices() {
    setTimeout(() => {
        async_fetch();
        async function async_fetch() {
            const platform_names = [
                'Coinbase',
                'Binance',
                'Lakebtc',
            ]
            const promise_coinbase = coinbase();
            const promise_binance = binance();
            const promise_lakebtc = lakebtc();
            const results = await Promise.all([
                        promise_binance,
                        promise_lakebtc,
                        promise_coinbase
                    ]);
            let time_now = Date.now()
            const get_common_pairs = (platform_data_1, platform_data_2, platform_name_1, platform_2, time) => {
                // Get common pairs between two excange platforms.

                var common_pairs_new = []
                // Go through all pairs in each platform.
                Object.keys(platform_data_1).forEach(function (platform_pair_1) {
                    Object.keys(platform_data_2).forEach(function (platform_pair_2) {
                        if (platform_pair_1 == platform_pair_2){
                            let a = parseFloat(platform_data_1[platform_pair_1]);
                            let b = parseFloat(platform_data_2[platform_pair_2]);
                            let dif = parseFloat((((a - b) / ((a + b) / 2)) * 100).toFixed(2));
                            common_pairs_new.push({
                                pair: platform_pair_1,
                                platform_name_1: platform_name_1,
                                platform_name_2: platform_name_2,
                                time: time_now,
                                difference: dif
                            })
                        }
                    });
                });
                return common_pairs_new
            }

            var common_pairs_new = []
            for (let idx_1=0; idx_1<results.length - 1; idx_1++){
                for (let idx_2=(idx_1+1); idx_2<results.length; idx_2++){
                    common_pairs_new.push(await get_common_pairs(
                        platform_data_1=results[idx_1],
                        platform_data_2=results[idx_2],
                        platform_name_1=platform_names[idx_1],
                        platform_name_2=platform_names[idx_2],
                        time=time_now));
                }
            }
            common_pairs_new = [].concat(...common_pairs_new);
            common_pairs_new.sort(compare_descending);
            console.log("All APIs called.")

            save_data(common_pairs_new)
            send_data(io)
        }
        // Repeat the call.
        fetch_prices();
    }, 20000);
};

const main = async () => {
    // coinbase()
    // coinbase_pairs = await init()
    // coinbase_ws(coinbase_pairs)
    // console.log(coinbase_pairs)
    // await sleep(1000)

    await fetch_prices()
}

main()
