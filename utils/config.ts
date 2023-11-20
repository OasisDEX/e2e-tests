require('dotenv').config();

export const baseUrl = process.env.BASE_URL ?? 'https://staging.summer.fi';

export const expectDefaultTimeout: number = 5_000;

export const hooksTimeout: number =
	baseUrl.includes('localhost') || baseUrl.includes('3000.csb.app') ? 130_000 : 110_000;

export const longTestTimeout: number =
	baseUrl.includes('localhost') || baseUrl.includes('3000.csb.app') ? 65_000 : 60_000;

export const veryLongTestTimeout: number =
	baseUrl.includes('localhost') || baseUrl.includes('3000.csb.app') ? 120_000 : 110_000;

export const extremelyLongTestTimeout: number =
	baseUrl.includes('localhost') || baseUrl.includes('3000.csb.app') ? 340_000 : 300_000;

export const positionTimeout: number =
	baseUrl.includes('localhost') || baseUrl.includes('3000.csb.app') ? 60_000 : 50_000;

export const portfolioTimeout: number =
	baseUrl.includes('localhost') || baseUrl.includes('3000.csb.app') ? 40_000 : 30_000;
