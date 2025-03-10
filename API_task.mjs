import fetch from 'node-fetch';

const PLAYER_EMAIL = 'aleksandnb@uia.no';

const SOLAR_SYSTEM_API_URL = 'https://api.le-systeme-solaire.net/rest/';
const RIS_BASE_URL = 'https://spacescavanger.onrender.com';

async function startTask() {
    const response = await fetch(`${RIS_BASE_URL}/start?player=${PLAYER_EMAIL}`);
    const data = await response.json();
    return data;
}

async function submitAnswer(answer) {
    const response = await fetch(`${RIS_BASE_URL}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            answer: answer,
            player: PLAYER_EMAIL,
        }),
    });

    const data = await response.json();
    console.log('Answer submitted:', data);
    return data;
}

async function fetchSolarSystemData(endpoint) {
    const response = await fetch(`${SOLAR_SYSTEM_API_URL}${endpoint}`);
    const data = await response.json();
    return data;
}

async function sunPin () {
    const sunData = await fetchSolarSystemData('/bodies/sun');

    const equatorialRadius = sunData.equaRadius;
    const meanRadius = sunData.meanRadius;

    const pinCode = equatorialRadius - meanRadius;
    console.log(`Pin code: ${pinCode}`);
  
    return pinCode;
}

async function findClosestAxialTilt() {
    
    const bodiesData = await fetchSolarSystemData('bodies/');
    const planets = bodiesData.bodies.filter(body => body.isPlanet);
    const earth = planets.find(planet => planet.id === 'terre');

    const earthAxialTilt = earth.axialTilt;
    console.log(`Earth's axial tilt: ${earthAxialTilt}`);

    let closestPlanet = null;
    let smallestDiff = Infinity;

    for (const planet of planets) {
        if (planet.id !== 'terre' && planet.axialTilt !== undefined) {
            const diff = Math.abs(planet.axialTilt - earthAxialTilt);
            if (diff < smallestDiff) {
                smallestDiff = diff;
                closestPlanet = planet;
            }
        }
    }

    console.log(`Closest planet: ${closestPlanet.englishName}. Axial tilt: ${closestPlanet.axialTilt}`);
    return closestPlanet.englishName;
}

async function findPlanetWithShortestDay() {
    const bodiesData = await fetchSolarSystemData('bodies/');
    const planets = bodiesData.bodies.filter(body => body.isPlanet);

    let shortestDayPlanet = null;
    let shortestDay = Infinity;

    for (const planet of planets) {
        if (planet.sideralRotation !== undefined){
            const rotationPeriod = Math.abs(planet.sideralRotation);
            if (rotationPeriod < shortestDay) {
                shortestDay = rotationPeriod;
                shortestDayPlanet = planet;
            }
        }
    }
    console.log(`Planet with the shortest day: ${shortestDayPlanet.englishName}. Sidereal rotation: ${shortestDay} hours`);
    return shortestDayPlanet.englishName;
}

async function findMoonsOnJupiter() {
    const jupiterData = await fetchSolarSystemData('/bodies/jupiter');

    const moonCount = jupiterData.moons.length;

    console.log(`Jupiter has ${moonCount} moons.`);
    return moonCount;
}

async function jupiterLargestMoon () {
    const jupiterData = await fetchSolarSystemData('/bodies/jupiter');

    let largestMoon = null;
    let maxRadius = 0;

    for (const moon of jupiterData.moons) {
        try {
            const moonId = moon.moon;
            const moonData = await fetchSolarSystemData(`/bodies/${moonId}`);

            if (moonData.meanRadius && moonData.meanRadius > maxRadius) {
                maxRadius = moonData.meanRadius;
                largestMoon = moonData.englishName;
            }
        } catch (error) {
        }
    }

    console.log(`Largest moon on Jupiter: ${largestMoon} with a radius ${maxRadius} km`);
    return largestMoon;
}

async function solveTask(task) {
    let answer = null;

    if (task === "sun_pin") {
        answer = await sunPin();
    } else if (task === "closest_axial_tilt") {
        answer = await findClosestAxialTilt();
    } else if (task === "shortest_day") {
        answer = await findPlanetWithShortestDay();
    } else if (task === "jupiter_moons") {
        answer = await findMoonsOnJupiter();
    } else if (task === "largest_moon") {
        answer = await jupiterLargestMoon();
    }

    const answerResponse = await submitAnswer(answer);

    const skeletonKey = answerResponse?.skeletonKey;
    if (skeletonKey) {
        const fs = require('fs');
        fs.writeFileSync('skeletonKey.txt', skeletonKey);
        console.log('Skeleton Key saved in created txt document "skeletonKey.txt"');
    }  

}

async function runTasks() {

    const startData = await startTask();
    console.log("Task started:", startData);

    await solveTask("sun_pin");

    await solveTask("closest_axial_tilt");

    await solveTask("shortest_day");

    await solveTask("jupiter_moons");

    await solveTask("largest_moon")
}

runTasks();

