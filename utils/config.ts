require('dotenv').config();

export const expectDefaultTimeout: number = 5_000;

export const hooksTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 130_000
		: 110_000;

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
		? 220_000
		: 200_000;

export const positionTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 50_000
		: 40_000;

export const portfolioTimeout: number =
	process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('3000.csb.app')
		? 40_000
		: 30_000;
