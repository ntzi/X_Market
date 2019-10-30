var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var methods = {}

// methods.save_data = async (input) => {
const save_data = async (input) => {
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
        { pair: 'btcusd',
          platform_name_1: 'Binance',
          platform_name_2: 'Coinbase',
          time: Date.now(),
          difference: 2.1
      }
    ]

    // Get the structure of the schema from coin.js
    var Coin = require('./coin');

    var db = mongoose.connection;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/x-market-mvp', async (err) => {
        if (err) throw err;
        console.log('Connected to database.');

        const update = () => {
            // Update the values of existing pair in database.
            console.log('Updating database...')
            for (item of input){
                var filter = { pair: item.pair, platform_name_1: item.platform_name_1,
                    platform_name_2: item.platform_name_2};
                var update = {$push: {time: item.time, difference: item.difference}};

                // Find the record of this pair in the database and add new values of time and difference.
                Coin.findOneAndUpdate(filter, update, function(err, coin) {
                    if (err) throw err;
                });
            }
        }

        const add_new_pairs = async () => {
            // Add new pairs in database.
            new_pairs = []
            for (item of input){
                var filter = { pair: item.pair, platform_name_1: item.platform_name_1,
                    platform_name_2: item.platform_name_2};
                // Search only.
                const temp = await Coin.find(filter, function(err, coin) {
                    if (err) throw err;
                    if (coin.length == 0) {
                        // Create Schema.
                        var newCoin = new Coin({
                            _id: new mongoose.Types.ObjectId(),
                            pair: item.pair,
                            platform_name_1: item.platform_name_1,
                            platform_name_2: item.platform_name_2,
                            time: item.time,
                            difference: item.difference
                        })
                        // Save Schema.
                        newCoin.save(function(err) {
                            if (err) throw err;
                            console.log('Saving new pair...');
                        })
                    }
                })
            }
        }
        // Update the values of existing pair in database.
        // await update()
        // Add new pairs in database.
        // First update and the add new pair, otherwise, each new pair would save the first value 2 times in database.
        // await add_new_pairs()



        // ***** Delete *****
        // Coin.remove().exec();

        //
        // Coin.find().limit(10).exec(function(err, res) {
        //     // io.emit('data_propagation', { data: res._data });
        //     console.log(res)
        //     console.log()
        //     // console.log(res[0].time)
        // });
    })
}


const get_data = async () => {
    // Get the structure of the schema from coin.js
    var Coin = require('./coin');

    var db = mongoose.connection;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/x-market-mvp', async (err) => {
        if (err) throw err;
        console.log('Connected to database.');
    })

    // ***** CAUTION ***** : THIS IMPLEMENTATION WILL CAUSE MEMORY PROBLEMS ONCE THE DATABASE BECOME LARGE
    // ENOUGH. IT SHOULD NOT FETCH THE WHOLE DATABASE ON EACH QUERY.
    var query_result = await Coin.find().limit()
    const access_db = async(query_result) => {
        var plot_data = {
            time: [],
            difference: []
        }

        // Calculate the time (in msecs) 1 week ago.
        var week_period = Date.now() - 604800000
        // var week_period = 1572259751265
        // var result = await Coin.find().limit(5).exec(function(err, res) {

        // var temp = () => {
// DELETE THIS ?
        // function temp (input) {
        // var result = await (res) => {
            data = []
            for (pair of query_result) {
                // console.log(pair)

                // Check wheter the most recent record of difference in this pair of coins is possitive or negative
                // and determine from which platform should buy and where to sell.
                if (pair.difference[pair.difference.length - 1] >= 0) {
                    var high = pair.platform_name_1
                    var low = pair.platform_name_2
                } else {
                    var high = pair.platform_name_2
                    var low = pair.platform_name_1
                }

                // Create the dataset for the plot.
                let time_values = []
                let difference_values = []
                var length = pair.time.length
                for (let i=length-1; i>=0 ; i--) {
                    // console.log(pair.time[i])
                    // Keep only the values of the last week.
                    if (pair.time[i] < week_period) {
                        break
                    }

                    time_values.push(pair.time[i])
                    difference_values.push(pair.difference[i])
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
                const num_of_points = 3 //20
                var total_points = time_values.length

                // Calculate the indices of the selected data to plot.
                // We don't want to plot all the points of the last week, instead we want to plot only 20, equally
                // distanced, points.
                var indices = makeArr(startValue=0, stopValue=total_points - 1, cardinality=num_of_points)

                let time = []
                let difference = []
                // Gather the 20 points that are equally distanced from each other in the last week of data points.
                for (index of indices) {
                    time.push(time_values[index])
                    difference.push(difference_values[index])
                }

                // Convert time format from msec to DD/MM/YY HH:MM
                for (let i=0; i<time.length; i++){
                    var date = new Date(time_values[i]);
                    var year = date.getFullYear()
                    var month = date.getMonth()
                    var day = date.getDate()
                    var hours = date.getHours()
                    var minutes = date.getMinutes()
                    var date_formated = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes

                    time[i] = date_formated
                }

                let plot = []
                for (let i=0; i<time.length; i++){
                    plot.push(
                        {
                            "Date": time[i],
                            "Difference": difference[i]
                        }
                    )
                }

                data.push({
                    pair: pair.pair,
                    high: high,
                    low: low,
                    difference: Math.abs(pair.difference[pair.difference.length - 1]),
                    plot: plot
                })
            }

            // console.log(data)
            // console.log()
            console.log(data[0].plot)

            io.emit('data_propagation_2', { data: data });
            // console.log(res)
            // console.log()
            // console.log(res[0].time)

            // return data
        // }

        // var result = await temp(res)
        // console.log(result)
        //
        // return result
        // await console.log(result)
        // return await data
        return data
    }
    var result_final = await access_db(query_result)
    // var result = access_db()
    //     // .then()
    //     .catch(console.error)

    console.log(result_final)
    return result_final
    // })
}


// const output = save_data()
module.exports = {
    save_data,
    get_data
}
