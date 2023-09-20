require('dotenv').config();

export const hooksTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 120_000
		: 60_000;

export const testTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 200_000
		: 130_000;

export const positionSimulationTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 50_000
		: 30_000;

export const portfolioTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 30_000
		: 20_000;
