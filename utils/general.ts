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
		}
		return positionResult;
	});

	const result: boolean = lengthResult && comparisonResult;

	return result;
};
