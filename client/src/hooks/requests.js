
const API_URL = 'v1';

// Load planets and return as JSON.
// set BUILD_PATH=../server/public&& 
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`)
  return await response.json();
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLauches = await response.json();
  return fetchedLauches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  })
}

async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.

  try {

    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  // Value are need to be add
  try {

    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'delete',
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};