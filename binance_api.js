const rp = require('request-promise');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var platform = {};
platform.binance = function() {
    /* Example in Node.js ES6 using request-promise */

    const requestOptions = {
      method: 'GET',
      // uri: 'https://api.binance.com/api/v3/ticker/price',
      uri: 'https://api.binance.com/api/v3/ticker/price',
      qs: {
        // 'start': '1',
        // 'limit': '1',
        // 'convert': 'USD'
        symbol: 'EVXBTC',
        // limit: '2'
      },
      headers: {
        'X-MBX-APIKEY': '5voMApdn1jp8AeVRdYazi7SXD32MpZjvwwrE3CGamIch96041K4QOOv0Ln4r1fTI'
        // 'secret-key': 'cCPQ6aYNCbUA3fmgYolN4FAFEnIJ5eJ4nU6zSOF33WYvAnkFBaZuZlOmNX1FTFPY'
      },
      json: true,
      gzip: true
    };

    rp(requestOptions).then(response => {
      console.log('API call response:', response);
      var result = response.price;
      console.log(result)

      io.on('connection', function (socket) {

        socket.on('welcome', { data: 'welcome' });

        // socket.on('get_data', function (socket) {
        //     console.log('Button clicked')
        //     // data = coinmarketcap_data();
        //     var temp = api.binance();
        //     console.log('Here')
        //     console.log('temp = ' + temp)
        //   });
      });

      // socket.on('welcome', function (data) {
          // console.log('socket here');
      // });

          // io.emit('server_data', { data: result });




      // //Establishing the connection
      // var new_db = "mongodb://localhost:27017"
      //
      // //establishing the connection
      // mongo.connect(new_db ,(error , client) => {
      //     if (error){
      //         throw error;
      //     }
      //     var db = client.db('demo_db')
      //
      //
      //     db.collection("crypto").insertOne(response, (err , collection) => {
      //         if(err) throw err;
      //         console.log("/nRecord inserted successfully");
      //         // console.log(collection);
      //     });
      //
      //     //To close the connection
      //     client.close();

      console.log('Done.')
      return response

    }).catch((err) => {
      console.log('API call error:', err.message);
    });

};

module.exports = platform;

// var result = values()
// console.log(values());
