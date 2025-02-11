const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
    console.log("MongoDB connection ready! ");
});

mongoose.connection.on('error', (err) => {
    console.log("error", err);
});

async function mongoConnet() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
    
}

module.exports = {
    mongoConnet,
    mongoDisconnect 
}