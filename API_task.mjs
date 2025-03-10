import fetch from 'node-fetch';

const PLAYER_EMAIL = 'aleksandnb@uia.no';

const SOLAR_SYSTEM_API_URL = 'https://api.le-systeme-solaire.net/rest/';
const RIS_BASE_URL = 'https://spacescavanger.onrender.com';

async function startTask() {
    const response = await fetch(`${RIS_BASE_URL}/start?player=${PLAYER_EMAIL}`);
    const data = await response.json();
    console.log('Task started:', data);
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

async function solveTask() {
    try {
        const startData = await startTask();

        const sunData = await fetchSolarSystemData('/bodies/sun');
        //console.log('Sun data:', sunData);

        const equatorialRadius = sunData.equaRadius;
        const meanRadius = sunData.meanRadius;

        const pinCode = equatorialRadius - meanRadius;
        console.log(`Pin code: ${pinCode}`);

        const answerResponse = await submitAnswer(pinCode);

        const skeletonKey = answerResponse?.skeletonKey;
        if (skeletonKey) {
            const fs = require('fs');
            fs.writeFileSync('skeletonKey.txt', skeletonKey);
            console.log('Skeleton Key saved in created txt document "skeletonKey.txt"');
        }  
    } catch (error) {
        console.error('Error during mission:', error);
    }
}

solveTask();

