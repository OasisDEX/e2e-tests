require('dotenv').config();

export const positionSimulationTimeout: number = process.env.BASE_URL.includes('localhost')
	? 25_000
	: 15_000;
