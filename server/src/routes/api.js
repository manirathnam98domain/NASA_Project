
const express = require('express');

const planetsRouter = require('./planets/planets.routes');
const launchesRouter = require('./lauches/launches.routes');

const api = express.Router();


api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;


