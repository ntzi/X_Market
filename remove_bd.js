let mongoose = require('mongoose');
let Coin = require('./coin');

const delete_database = async () => {
    // Delete the database.

    const local_db = 'mongodb://localhost/x-market-mvp';
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    await mongoose.connect(process.env.MONGODB_URI || local_db,  (err) => {
        if (err) throw err;
    })
    let filter = {};
    await Coin.deleteMany(filter, (err) => {
        if (err) throw err
    })
    console.log('Database deleted.')
    return process.exit()
}

delete_database()