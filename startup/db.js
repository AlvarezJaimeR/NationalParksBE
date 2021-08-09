const mongoose = require('mongoose');
const config = require('config');

var uri = process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI;

function connectDB() {
    mongoose.connect(
        uri || config.get('mongoURI'),
        {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to MongoDB...'))
        .catch((err) => {
            console.log(`Could not connect to MongoDB. ERROR: ${err}`);
            process.exit(1);
        });
}

module.exports = connectDB;