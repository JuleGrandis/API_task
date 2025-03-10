import { futimesSync } from 'fs';

const fetch = require('node-fetch');

const PLAYER_EMAIL = 'aleksandnb@uia.no';

const SOLAR_SYSTEM_API_URL = 'https://api.le-systeme-solaire.net/en/';
const RIS_BASE_URL = 'https://spacescavanger.onrender.com/';

async function startTask() {
    const response = await fetch(`${RIS_BASE_URL}/start?player=${PLAYER_EMAIL}`);
    const data = await response.json();
    console.log('Task started:', data);
    return data;
}

async function submitAnswer(answer) {
    const response = await fetch(`${RIS_BASE_URL}/answer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
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


