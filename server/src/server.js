const http = require('http')
const fs = require('fs');
require("dotenv").config();

const app = require('./app');
const { mongoConnet } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model')


const PORT = process.env.PORT || 8000;
const server = http.createServer(app);


async function startServer() {

    await mongoConnet();
    await loadPlanetsData();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}....`);
    });
}

startServer();
