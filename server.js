
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








// -----------------------------------------
// TEST Fetching from database.
// -----------------------------------------

const get_data = () => {
//     // Get the structure of the schema from coin.js
//     var Coin = require('./coin');
//
//     var db = mongoose.connection;
//     mongoose.set('useNewUrlParser', true);
//     mongoose.set('useUnifiedTopology', true);
//     mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/x-market-mvp', async (err) => {
//         if (err) throw err;
//         console.log('Connected to database.');
//
//         async function async_fetch() {
//             var plot_data = {
//                 time: [],
//                 difference: []
//             }
//
//             // Calculate the time (in msecs) 1 week ago.
//             var week_period = Date.now() - 604800000
//             // var week_period = 1572259751265
//             var res = await Coin.find().limit(5).exec(function(err, res) {
//             // var res = await Coin.find({_time: {$gt:week_period}}).sort({_time: -1}).limit(5).exec(function(err, res) {
//                 data = []
//                 for (pair of res) {
//                     // console.log(pair)
//
//                     // Check wheter the most recent record of difference in this pair of coins is possitive or negative
//                     // and determine from which platform should buy and where to sell.
//                     if (pair.difference[pair.difference.length - 1] >= 0) {
//                         var high = pair.platform_name_1
//                         var low = pair.platform_name_2
//                     } else {
//                         var high = pair.platform_name_2
//                         var low = pair.platform_name_1
//                     }
//
//                     // Create the dataset for the plot.
//                     let time_values = []
//                     let difference_values = []
//                     var length = pair.time.length
//                     for (let i=length-1; i>=0 ; i--) {
//                         // console.log(pair.time[i])
//                         // Keep only the values of the last week.
//                         if (pair.time[i] < week_period) {
//                             break
//                         }
//
//                         time_values.push(pair.time[i])
//                         difference_values.push(pair.difference[i])
//                     }
//
//                     function makeArr(startValue, stopValue, cardinality) {
//                         // Returns an array of numbers based on start, stop and desired number of return values
//                         var arr = [];
//                         var step = (stopValue - startValue) / (cardinality - 1);
//                         for (var i = 0; i < cardinality; i++) {
//                             arr.push(Math.round(startValue + (step * i)));
//                         }
//                         return arr;
//                     }
//
//                     // Set the number of points to plot in the last week
//                     const num_of_points = 3 //20
//                     var total_points = time_values.length
//
//                     // Calculate the indices of the selected data to plot.
//                     // We don't want to plot all the points of the last week, instead we want to plot only 20, equally
//                     // distanced, points.
//                     var indices = makeArr(startValue=0, stopValue=total_points - 1, cardinality=num_of_points)
//
//                     let time = []
//                     let difference = []
//                     // Gather the 20 points that are equally distanced from each other in the last week of data points.
//                     for (index of indices) {
//                         time.push(time_values[index])
//                         difference.push(difference_values[index])
//                     }
//
//                     // Convert time format from msec to DD/MM/YY HH:MM
//                     for (let i=0; i<time.length; i++){
//                         var date = new Date(time_values[i]);
//                         var year = date.getFullYear()
//                         var month = date.getMonth()
//                         var day = date.getDate()
//                         var hours = date.getHours()
//                         var minutes = date.getMinutes()
//                         var date_formated = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes
//
//                         time[i] = date_formated
//                     }
//
//                     let plot = []
//                     for (let i=0; i<time.length; i++){
//                         plot.push(
//                             {
//                                 "Date": time[i],
//                                 "Difference": difference[i]
//                             }
//                         )
//                     }
//
//                     data.push({
//                         pair: pair.pair,
//                         high: high,
//                         low: low,
//                         difference: Math.abs(pair.difference[pair.difference.length - 1]),
//                         plot: plot
//                     })
//                 }
//
//                 // console.log(data)
//                 // console.log()
//                 // console.log(data[0].plot)
//
//                 io.emit('data_propagation_2', { data: data });
//                 // console.log(res)
//                 // console.log()
//                 // console.log(res[0].time)
//             });
//         }
//         async_fetch()
//             // .then()
//             .catch(console.error)
//
//     })







    // Send latest data to new connected client.
    db.once('open', function() {
        // Get the latest entry.
        Data.findOne().sort({_id: -1}).exec(function(err, res) {
            io.emit('data_propagation', { data: res._data });
            // console.log(res._data)
        });

        // var week_period = Date.now() - 604800000
        // var res = await Data.find({_time: {$gt:week_period}})

        Data.find().sort({_time: -1}).limit(5).exec(function(err, res) {
            // io.emit('data_propagation', { data: res._data });
            // console.log(res)
        });

        // socket.on('plot_request', function (input) {

            // async function async_fetch(input) {
            async function async_fetch() {
                // console.log(input)
                    var pair_requested = 'xrpbtc'
                    var high_requested = 'Binance'
                    var low_requested = 'Lakebtc'

                // var pair_requested = input.data.pair_request
                // var high_requested = input.data.high_request
                // var low_requested = input.data.low_request
                var plot_data = {
                    time: [],
                    difference: []
                }

                // Calculate the time (in msecs) 1 week ago.
                var week_period = Date.now() - 604800000
                var res = await Data.find({_time: {$gt:week_period}})

                // console.log(input.data.pair_request)
                // console.log(high_requested)
                // console.log(low_requested)

                // Search all timestamps.
                for (pack of res) {
                    // Search all pairs.
                    for (pair of pack._data) {
                        // console.log(pair.pair)
                        if ((pair.pair == pair_requested) && (pair.high == high_requested) &&
                            (pair.low == low_requested)) {
                            // console.log('found')

                            break
                        }
                    }
                    // console.losg(pair)

                    // ******* CONVERT TO TIME NOW ******
                    // console.log(typeof(pack._time))
                    var date = new Date(pack._time);
                    var year = date.getFullYear()
                    var month = date.getMonth()
                    var day = date.getDate()
                    var hours = date.getHours()
                    var minutes = date.getMinutes()
                    var date_formated = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes

                    plot_data.time.push(date_formated)
                    plot_data.difference.push(pair.difference)
                }

                function makeArr(startValue, stopValue, cardinality) {
                    // Returns an array of numbers based on start, stop and desired number of return values
                    var arr = [];
                    var step = (stopValue - startValue) / (cardinality - 1);
                    for (var i = 0; i < cardinality; i++) {
                        arr.push(Math.round(startValue + (step * i)));
                    }
                    return arr;
                }

                // Set the number of points to plot in the last week
                const num_of_points = 20
                var total_points = plot_data.time.length
                // const step = total_points/ num_of_points
                // console.log(step)
                // console.log(plot_data.time.length)

                // Calculate the indices of the selected data to plot.
                // We don't want to plot all the points of the last week, instead we want to plot only 20, equally
                // distanced, points.
                var indices = makeArr(startValue=0, stopValue=total_points - 1, cardinality=num_of_points)
                // console.log(indices)

                var temp_time = []
                var temp_difference = []
                // Gather the 20 points that are equally distanced from each other in the last week of data points.
                for (index of indices) {
                    temp_time.push(plot_data.time[index])
                    temp_difference.push(plot_data.difference[index])
                }

                // console.log(plot_data.time)

                plot_data.time = temp_time
                plot_data.difference = temp_difference

                // console.log(plot_data.time)

                io.emit('plot', { data: plot_data });
            }
            // async_fetch(input)
            async_fetch()
                // .then(console.log)
                .catch(console.error)
        // })
    })
}













// -----------------------------------------
// Manage client connection/disconnection.
// -----------------------------------------
var active_users = 0;
io.on('connection', function (socket) {
    active_users++;
    console.log('New client connected...')
    console.log('Active users: %d', active_users);

    // Get data from database on new connection.
    var db = mongoose.connection;
    // 'useNewUrlParser' and 'useUnifiedTopology' parameters are required for not getting a warning from mongoose.
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/x-market-mvp')

    db.on('error', console.error.bind(console, 'connection error:'));

    // Send latest data to new connected client.
    db.once('open', function() {
        // Get the latest entry.
        Data.findOne().sort({_id: -1}).exec(function(err, res) {
            io.emit('data_propagation', { data: res._data });
        });

        socket.on('plot_request', function (input) {

            async function async_fetch(input) {
                console.log('row clicked')
                // console.log(input)
                //     var pair_requested = 'xrpbtc'
                //     var high_requested = 'Binance'
                //     var low_requested = 'Lakebtc'

                var pair_requested = input.data.pair_request
                var high_requested = input.data.high_request
                var low_requested = input.data.low_request
                var plot_data = {
                    time: [],
                    difference: []
                }

                // Calculate the time (in msecs) 1 week ago.
                var week_period = Date.now() - 604800000
                var res = await Data.find({_time: {$gt:week_period}})

                // console.log(input.data.pair_request)
                // console.log(high_requested)
                // console.log(low_requested)

                // Search all timestamps.
                for (pack of res) {
                    // Search all pairs.
                    for (pair of pack._data) {
                        // console.log(pair.pair)
                        if ((pair.pair == pair_requested) && (pair.high == high_requested) &&
                            (pair.low == low_requested)) {
                            // console.log('found')

                            break
                        }
                    }
                    // console.losg(pair)

                    // ******* CONVERT TO TIME NOW ******t
                    // console.log(typeof(pack._time))
                    var date = new Date(pack._time);
                    var year = date.getFullYear()
                    var month = date.getMonth()
                    var day = date.getDate()
                    var hours = date.getHours()
                    var minutes = date.getMinutes()
                    var date_formated = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes

                    plot_data.time.push(date_formated)
                    plot_data.difference.push(pair.difference)
                }

                function makeArr(startValue, stopValue, cardinality) {
                    // Returns an array of numbers based on start, stop and desired number of return values
                    var arr = [];
                    var step = (stopValue - startValue) / (cardinality - 1);
                    for (var i = 0; i < cardinality; i++) {
                        arr.push(Math.round(startValue + (step * i)));
                    }
                    return arr;
                }

                // Set the number of points to plot in the last week
                const num_of_points = 20
                var total_points = plot_data.time.length
                // const step = total_points/ num_of_points
                // console.log(step)
                // console.log(plot_data.time.length)

                // Calculate the indices of the selected data to plot.
                // We don't want to plot all the points of the last week, instead we want to plot only 20, equally
                // distanced, points.
                var indices = makeArr(startValue=0, stopValue=total_points - 1, cardinality=num_of_points)
                // console.log(indices)

                var temp_time = []
                var temp_difference = []
                // Gather the 20 points that are equally distanced from each other in the last week of data points.
                for (index of indices) {
                    temp_time.push(plot_data.time[index])
                    temp_difference.push(plot_data.difference[index])
                }

                // console.log(plot_data.time)

                plot_data.time = temp_time
                plot_data.difference = temp_difference

                // console.log(plot_data.time)

                io.emit('plot', { data: plot_data });
            }
            async_fetch(input)
                // .then(console.log)
                .catch(console.error)
        })
    })



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

const first_run = true
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
            function get_common_pairs(platform_data_1, platform_data_2, platform_name_1, platform_2){
                // Get common pairs between two excange platforms.

                var common_pairs = []
                // Go through all pairs in each platform.
                Object.keys(platform_data_1).forEach(function (platform_pair_1) {
                    Object.keys(platform_data_2).forEach(function (platform_pair_2) {
                        if (platform_pair_1 == platform_pair_2){
                            let a = parseFloat(platform_data_1[platform_pair_1]);
                            let b = parseFloat(platform_data_2[platform_pair_2]);
                            let dif = parseFloat(((Math.abs(a - b) / ((a + b) / 2)) * 100).toFixed(2));
                            if (a > b) {
                                let high_platform = platform_name_1;
                                let low_platform = platform_name_2;
                                common_pairs.push(
                                    {
                                        pair: platform_pair_1,
                                        high: high_platform,
                                        low: low_platform,
                                        difference: dif
                                    }
                                )
                            } else {
                                let high_platform = platform_name_2;
                                let low_platform = platform_name_1;
                                common_pairs.push(
                                    {
                                        pair: platform_pair_1,
                                        high: high_platform,
                                        low: low_platform,
                                        difference: dif
                                    }
                                )
                            }
                        }
                    });
                });
                return common_pairs
            }

            var common_pairs = []
            for (let idx_1=0; idx_1<results.length - 1; idx_1++){
                for (let idx_2=(idx_1+1); idx_2<results.length; idx_2++){
                    common_pairs.push(await get_common_pairs(
                        platform_data_1=results[idx_1],
                        platform_data_2=results[idx_2],
                        platform_name_1=platform_names[idx_1],
                        platform_name_2=platform_names[idx_2]));
                }
            }
            // Convert 2d to 1d array, because each platform comparison results are in seperate arrays.
            common_pairs = [].concat(...common_pairs);
            common_pairs.sort(compare_descending);
            console.log("All APIs called.")
            // io.emit('data_ascending', { data: common_pairs });
            io.emit('data_propagation', { data: common_pairs });

            // save_data(common_pairs)
            console.log(common_pairs)

            // Save to database.
            var db = mongoose.connection;
            mongoose.set('useNewUrlParser', true);
            mongoose.set('useUnifiedTopology', true);
            mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/x-market-mvp')
            // Create the structure of the data to save.
            db.once('open', function() {
                  var data_entry = new Data({
                      _time: Date.now(),
                      _data: common_pairs
                  });
                  // Save to database.
                  data_entry.save(function (err, res) {
                      if (err) return console.error(err);
                  });
            });

        }
        // Repeat the call.
        fetch_prices();
    }, 20000);
};

const main = async () => {
    // get_data()

    // var database = require('./db')
    // database.get_data('hey')

    // database(function (err, conn) {
    //     if (err) throw err
    //   })


    // database.save_data()

    // coinbase()
    // coinbase_pairs = await init()
    // coinbase_ws(coinbase_pairs)
    // console.log(coinbase_pairs)
    // await sleep(1000)

    await fetch_prices()
}

main()
