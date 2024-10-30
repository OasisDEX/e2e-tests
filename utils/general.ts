import { expect, test } from '@playwright/test';
import { App } from 'src/app';
import { expectDefaultTimeout } from './config';

export const shortenAddress = (address: string) =>
	`${address.slice(0, 6)}...${address.slice(-5)}`.toLowerCase();

export const comparePositionsData = (stagingPositions, productionPositions) => {
	const lengthResult: boolean = stagingPositions.length === productionPositions.length;
	const comparisonResult: boolean = stagingPositions.every((stagingPosition) => {
		const positionResult: boolean = productionPositions.some((productionPosition) =>
			Object.keys(stagingPosition).every((key) => stagingPosition[key] === productionPosition[key])
		);
		if (!positionResult) {
			console.log('Inconsistent Position Data - Staging: ', stagingPosition);
			console.log('Inconsistent Position Data - Production: ', productionPositions[0]);
		}
		return positionResult;
	});

	const result: boolean = lengthResult && comparisonResult;

	return result;
};

export const reloadUntilCorrect = async (app: App) => {
	await test.step('Reload page until it is correct', async () => {
		await expect(async () => {
			await app.page.reload();
			await app.position.overview.shouldBeVisible({ timeout: expectDefaultTimeout * 5 });
		}).toPass();
	});
};

export const getPoolFromPositionUrl = ({
	url,
	positionType,
}: {
	url: string;
	positionType: 'borrow' | 'multiply';
}): string => {
	const pool: string = url.substring(
		url.indexOf(positionType) + (positionType === 'multiply' ? 9 : 7),
		url.includes('#') ? url.indexOf('#') : url.length
	);

	return pool;
};

export const getCollTokenFromPositionUrl = ({
	url,
	positionType,
}: {
	url: string;
	positionType: 'borrow' | 'multiply';
}): string => {
	const collToken: string = getPoolFromPositionUrl({ url, positionType }).split('-')[0];

	return collToken;
};
