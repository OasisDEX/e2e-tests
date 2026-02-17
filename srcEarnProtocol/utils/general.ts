export const allStables = ['EURC', 'USDC', 'USDC.E', 'USDT', 'USD₮0'];
export const allAssets = allStables.concat(['ETH']);

export const allStablesWithDuplicates = [
	'EURC',
	'USDC',
	'USDC',
	'USDC',
	'USDC',
	'USDC',
	'USDC.E',
	'USDT',
	'USD₮0',
	'USD₮0',
];

export const allAssetsWithDuplicates = allStablesWithDuplicates.concat(['ETH', 'ETH', 'ETH']);
