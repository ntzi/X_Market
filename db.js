var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var methods = {}

const save_data = (input, local_db='mongodb://localhost/x-market-mvp') => {
    // Save new data to database.

    promise = new Promise((resolve, reject) => {
        const execute = async () => {
            // Get the structure of the schema from coin.js
            var Coin = require('./coin');

            var db = mongoose.connection;
            mongoose.set('useNewUrlParser', true);
            mongoose.set('useUnifiedTopology', true);
            await mongoose.connect(process.env.MONGODB_URI || local_db,  (err) => {
                if (err) throw err;
            })

            const update = () => {
                // Update the values of existing pairs in database.

                console.log('Updating database...')
                for (let item of input){
                    var filter = { pair: item.pair, platform_name_1: item.platform_name_1,
                        platform_name_2: item.platform_name_2};
                    var update = {$push: {time: item.time, difference: item.difference}};

                    // Find the record of this pair in the database and add new values of time and difference.
                    Coin.findOneAndUpdate(filter, update, function(err, coin) {
                        if (err) throw err;
                    });
                }
            }

            const add_new = async () => {
                // Add new pairs in database.

                new_pairs = []
                // Get one by one the records from database.
                for (item of input){
                    var filter = { pair: item.pair, platform_name_1: item.platform_name_1,
                        platform_name_2: item.platform_name_2};
                    // Search the database.
                    const coin = await Coin.find(filter, (err) => {
                        if (err) throw err
                    })
                    // If coin not found.
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
                }
            }

            const delete_unused = async () => {
                // Delete unused pairs in database.

                const pairs = await Coin.find((err) => {
                    if (err) throw err
                })

                const find = () => {
                    let found = false
                    let counter_deleted = 0
                    // Scan all pairs existed in database.
                    for (pair of pairs) {
                        // Scan all new pairs that are about to be saved in the database.
                        for (new_pair of input){
                            if  ((pair.pair == new_pair.pair) &&
                                (pair.platform_name_1 == new_pair.platform_name_1) &&
                                (pair.platform_name_2 == new_pair.platform_name_2)) {
                                    found = true
                            }
                        }
                        // If a pair in the database is not going to get updated from the new values, it gets deleted.
                        if (! found){
                            let filter = {_id: pair.id};
                            Coin.findByIdAndRemove(filter, (err) => {
                                if (err) throw err
                            })
                            counter_deleted += 1
                        }
                    }
                    return counter_deleted
                }
                // TODO: Make sure this await waits for the loop to complete.
                let counter_deleted = await find()
                if (counter_deleted > 0){
                    console.log('Unused pairs deleted: %d', counter_deleted)
                }
            }
            // Delete unused pairs in database.
            await delete_unused()
            // Update the values of existing pair in database.
            await update()
            // Add new pairs in database.
            // First update and the add new pair, otherwise, each new pair would save the first value 2 times in database.
            await add_new()

            // ***** Delete *****
            // console.log('Deleting databse...')
            // Coin.remove().exec();

            resolve()
        }
        execute()
    })

    return promise
}


const send_data = (io, local_db='mongodb://localhost/x-market-mvp') => {
    // Get all needed data from database and push them to client.

    console.log('Sending data...')
    promise = new Promise((resolve, reject) => {
        const execute = async () => {
            // Get the structure of the schema from coin.js
            var Coin = require('./coin');

            // Connect to db.
            mongoose.set('useNewUrlParser', true);
            mongoose.set('useUnifiedTopology', true);
            mongoose.connect(process.env.MONGODB_URI || local_db, (err) => {
                if (err) throw err;
            })

            // The number of records stored in a period of one week given that every new record is created every
            // minute.
            let period = 1 * 60 * 24 * 7
            var query_result = await Coin.find((err) => {
                if (err) throw err
            }).limit(period)


            // console.log(query_result)



            // Calculate the time (in msecs) 1 week ago.
            var week_period = Date.now() - 604800000
            let data = []

            for (pair of query_result) {
                // Get the last record of the differences.
                var latest_difference = pair.difference[pair.difference.length - 1]
                // Check wheter the most recent record of difference in this pair of coins is positive or negative
                // and determine from which platform should buy and where to sell.
                if (latest_difference >= 0) {
                    var high = pair.platform_name_1
                    var low = pair.platform_name_2
                    var sign = 1
                } else {
                    var high = pair.platform_name_2
                    var low = pair.platform_name_1
                    var sign = -1
                    // Revert values of the last value.
                    latest_difference = latest_difference * sign
                }

                const makeArr = (startValue, stopValue, cardinality) => {
                    // Returns an array of numbers based on start, stop and desired number of return values
                    let arr = [];
                    let step = (stopValue - startValue) / (cardinality - 1);
                    for (let i = 0; i < cardinality; i++) {
                        arr.push(Math.round(startValue + (step * i)));
                    }
                    return arr;
                }

                // Set the number of points to plot in the last week
                const num_of_points = 10
                var total_points = pair.time.length

                // Calculate the indices of the selected data to plot.
                // We don't want to plot all the points of the last week, instead we want to plot only 10, equally
                // distanced, points.
                var indices = makeArr(startValue=0, stopValue=total_points - 1, cardinality=num_of_points)
                // Gather the 10 points that are equally distanced from each other in the last week of data points.
                let difference = []
                let time = []
                for (let index of indices) {
                    time.push(pair.time[index])
                    difference.push(pair.difference[index])
                }

                // Convert time format from msec to UTC format.
                for (i in time){
                    time[i] = new Date(time[i]).toUTCString()
                }
                let plot = []

                // Loop from the end to the start in order to display the plot left to right (last value on the
                // right end).
                for (i in time){
                    plot.push(
                        {
                            "Date": time[i],
                            // Revert values if the last value is negative ('sign' is assigned earlier).
                            "Difference": difference[i] * sign
                        }
                    )
                }
                data.push({
                    pair: pair.pair,
                    high: high,
                    low: low,
                    difference: latest_difference,
                    plot: plot
                })


                // break


            }
            // io.emit doesn't work without io.on('connection')
            io.on('connection', (socket) => {
                // Nothing needed
            })
            io.emit('table_data', {data: data});
            // Returning the data with resolve() is required only in testing (db_test.js).
            resolve(data)
        }
        execute()
    })
    return promise
}

module.exports = {
    save_data,
    send_data
};
