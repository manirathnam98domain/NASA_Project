
const {getAllplanets} = require('../../models/planets.model')


async function httpgetAllPlanets(req, res) {

    return  res.status(200).json(await getAllplanets());
}


module.exports = {
    httpgetAllPlanets
};


