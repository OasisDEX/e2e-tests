require('dotenv').config();

export const expectDefaultTimeout: number = 5_000;

export const hooksTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 120_000
		: 90_000;

export const longTestTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 60_000
		: 55_000;

export const veryLongTestTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 100_000
		: 80_000;

export const extremelyLongTestTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 200_000
		: 160_000;

export const positionTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 50_000
		: 40_000;

export const portfolioTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 30_000
		: 20_000;
