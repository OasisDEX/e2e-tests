require('dotenv').config();

export const hooksTimeout: number = process.env.BASE_URL.includes('localhost') ? 120_000 : 60_000;

export const testTimeout: number = process.env.BASE_URL.includes('localhost') ? 200_000 : 90_000;

export const positionSimulationTimeout: number = process.env.BASE_URL.includes('localhost')
	? 30_000
	: 20_000;

export const portfolioTimeout: number = process.env.BASE_URL.includes('localhost')
	? 30_000
	: 20_000;
