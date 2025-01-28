

const { response } = require("express");
const launchesDatebase = require("./lauches.mongo");
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;

// launches.set(launch.flightNumber, launch);

const SPACEX_URL = 'https://api.spacexdata.com/v4/launches/query';


async function populateLaunches() {
    console.log('Downloading Launch data....')
    const response = await axios.post(SPACEX_URL, {
        "query": {},
        "options": {
            "pagination": false,
            "populate": [
                {
                    "path": "rocket",
                    "select": {
                        "name": 1
                    }
                },
                {
                    "path": "payloads",
                    "select": {
                        "customers": 1
                    }

                }
            ]
        }
    });

    if (response.status !== 200) {
        console.log("Problem downloading launch data");
        throw new Error("Launch data download failed");
    }


    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {

        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        };
        console.log(`${launch.flightNumber} ${launch.mission}`);

        // TODO: popolute launches collection...
        // await saveLaunch(launch);
    }
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "FalconSat",
        mission: "FalconSat"

    })
    if (firstLaunch) {
        console.log('Launch data Aleady loaded!');

    } else {
        await populateLaunches();
    }



}

async function findLaunch(filter) {
    return await launchesDatebase.findOne(filter);
}

async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values());
    const result = await launchesDatebase.find({}, { '_id': 0, '__v': 0 })
    .sort({"flightNumber":1})
    .skip(skip)
    .limit(limit);
    console.log("result", result);
    return result;
}

async function exitsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
}

async function getLatestFlighNumber() {
    const latestlaunch = await launchesDatebase
        .findOne({})
        .sort('-flightNumber');
    if (!latestlaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestlaunch.flightNumber;
}

async function saveLaunch(launch) {
    await launchesDatebase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    })
}


async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if (!planet) {
        throw new Error('No matching planet found');
    }

    const newFlightNumner = await getLatestFlighNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to mastery ', 'NASA'],
        flightNumber: newFlightNumner,
    })

    await saveLaunch(newLaunch);

}

// function addNewLaunch(launch) {
//      latestFlightNumber++;
//      launches.set(
//         latestFlightNumber,
//         Object.assign(launch,{
//         success:true,
//         upcoming:true,
//         customers:['Zero toMastery', 'NASA'],
//         flightNumber:latestFlightNumber
//      }));
// }


async function abortLaunchById(launchId) {
    const aborted = await launchesDatebase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;


}


module.exports = {
    loadLaunchData,
    exitsLaunchWithId,
    abortLaunchById,
    getAllLaunches,
    scheduleNewLaunch,
}
