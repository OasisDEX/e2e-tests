export const allStables = ['EURC', 'USDC', 'USDT', 'USD₮0']; // ARBITRUM and SONIC are set to 0.00
export const allAssets = allStables.concat(['ETH']);

export const allStablesWithDuplicates = [
	// ARBITRUM and SONIC are set to 0.00
	'EURC',
	'USDC',
	'USDC',
	'USDC',
	'USDC',
	'USDC',
	'USDT',
	'USD₮0',
];

export const allAssetsWithDuplicates = allStablesWithDuplicates.concat([
	'ETH',
	'ETH',
	'ETH',
	'ETH',
]);
