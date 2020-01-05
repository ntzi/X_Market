var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var database = require('../../db');

const send_data_test = async(io) => {
    // Get all needed data from database and push them to client.


    const generate_data = () => {
        let promise = new Promise((resolve, reject) => {
            var week_period = Date.now() - 604800000;
            // The number of records stored in a period of one week given that every new record is created every
            // minute.
            let period = 1 * 60 * 24 * 7;
            // Calculated every one minute in milliseconds.
            let time_now = week_period + (0 * 60000);
            var record = [{
                    pair: 'test_pair_1',
                    platform_name_1: 'test_platform_1',
                    platform_name_2: 'test_platform_2',
                    time: [time_now],
                    difference: [Math.floor(Math.random() * 100)]
                },
                {
                    pair: 'test_pair_2',
                    platform_name_1: 'test_platform_2',
                    platform_name_2: 'test_platform_1',
                    time: [time_now],
                    difference: [Math.floor(Math.random() * 100)]
                },
                {
                    pair: 'test_pair_3',
                    platform_name_1: 'test_platform_1',
                    platform_name_2: 'test_platform_2',
                    time: [time_now],
                    difference: [Math.floor(Math.random() * 100)]
                }
            ]

            // Fill array with random 'time' and 'difference' prices.
            for (let i = 1; i < period; i++) {
                // Calculated every one minute in milliseconds.
                let time_now = week_period + (i * 60000);
                record[0].time.push(time_now)
                record[0].difference.push(Math.floor(Math.random() * 100))
                record[1].time.push(time_now)
                record[1].difference.push(Math.floor(Math.random() * 100))
                record[2].time.push(time_now)
                record[2].difference.push(Math.floor(Math.random() * 100))
            }
            resolve(record)
        })
        return promise
    }

    let promise = generate_data()
    let record = await Promise.resolve(promise)
    // let record = await generate_data()


    // Create a new database 'test_db' for the test.
    // const test_db = 'mongodb://localhost/x-market-mvp'
    const test_db = 'mongodb://localhost/test_db';

    // Save new data to database.
    // let promise_save_data = database.save_data(record, local_db=test_db);
    // let result = await Promise.resolve(promise_save_data);

    let promise_send_data = database.send_data(io, local_db=test_db);
    var data = await Promise.resolve(promise_send_data);

    // Test 1
    const test_1 = (data) => {
        // Test whether the points of each plot is 10 or not.

        let expected_num_of_points = 10
        for (let index in data) {
            let num_of_points = data[index].plot.length
            // If the points of the plot in a single pair are not 10, the test fails.
            if (num_of_points !== expected_num_of_points) {
                return 'Fail'
            }
        }
        return 'Pass'
    }

    let test_1_result = await test_1(data)
    console.log(`Test 1: ${test_1_result}`)

    // Test 2
    const test_2 = (data) => {
        // Test the time difference between two successively points.
        // For 10 points in a week, should be ~16 hours of difference between each point.

        let num_of_points = 10
        let num_of_days = 7

        // Calculate the time difference, in milliseconds, that should be between two points.
        let expected_msec_dif = (num_of_days * 24 * 60 * 60 * 1000) / (num_of_points - 1)

        // Loop through all pairs.
        for (let pair_index in data) {
            // Loop through all plot points in a pair.
            for (let point_index = 0; point_index < data[pair_index].plot.length - 1; point_index ++) {
                // The middle point does not have the same distance that all the other have between them, although it
                // has the same distance from the next the previous point.
                let middle_point_error = false
                // Date of a point.
                let point_date = data[pair_index].plot[point_index].Date
                // Date of the next point.
                let point_date_next = data[pair_index].plot[point_index + 1].Date
                // Difference of the two points in milliseconds.
                let msec_dif = new Date(point_date_next) - new Date(point_date);
                // If the distance between subsequent points is not equal, except the middle point, the test fails.
                if ((msec_dif !== expected_msec_dif) && (middle_point_error)){
                    return 'Fail'
                } else {
                    middle_point_error = true
                }
            }
        }
        return 'Pass'
    }

    let test_2_result = await test_2(data)
    console.log(`Test 2: ${test_2_result}`)


    const delete_database = () => {
        // Delete the new database 'test_db'.

        console.log('Deleting database...')
        var Coin = require('../../coin');
        Coin.remove().exec();
    }
    // await delete_database()
};

// console.log('Start');
send_data_test(io);
// console.log(data)
// io.on('connection', (socket) => {
//     console.log('data')
// })

// console.log('End');
//