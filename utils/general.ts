import { App } from 'src/app';
import { expect } from './setup';
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
			console.log('+++ Inconsistent Position Data - Staging: ', stagingPosition);
			console.log('+++ Inconsistent Position Data - Production: ', productionPositions[0]);
		}
		return positionResult;
	});

	const result: boolean = lengthResult && comparisonResult;

	return result;
};

export const reloadUntilCorrect = async (app: App) => {
	await expect(async () => {
		await app.page.reload();
		await app.position.overview.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	}).toPass();
};
