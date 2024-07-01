export const wEthContractAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const usdcContractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
export const ajnaPoolAddress = '0x3ba6a019ed5541b5f5555d8593080042cf3ae5f4';

export const sparkEthereumMultiplyPools = [
	'ETH-DAI',
	'RETH-DAI',
	'WSTETH-DAI',
	'WBTC-DAI',
	'SDAI-ETH',
	'WEETH-DAI',
];

export const morphoEthereumMultiplyPools_1 = [
	'WSTETH-USDC',
	'WSTETH-USDT',
	// 'WSTETH-USDA', - BUG 15978 - Pool should be removed for Multiply
	'WBTC-USDC',
	'WBTC-USDT',
];

export const morphoEthereumMultiplyPools_2 = [
	'USDE-DAI-1',
	'USDE-DAI-2',
	'USDE-DAI-3',
	'SUSDE-USDT',
	'OSETH-ETH',
];

export const morphoEthereumMultiplyPools_3 = [
	'WSTETH-ETH-1',
	'WSTETH-ETH-2',
	'WSTETH-ETH-3',
	'WEETH-ETH',
	'WOETH-ETH',
];

export const morphoEthereumMultiplyPools_4 = [
	'MKR-USDC',
	'EZETH-ETH',
	'SUSDE-DAI-1',
	'SUSDE-DAI-2',
	'SUSDE-DAI-3',
];

export const aaveV3EthereumMultiplyPools_1 = [
	'ETH-DAI',
	'ETH-USDC',
	'ETH-USDT',
	'ETH-GHO',
	'ETH-WBTC',
];

export const aaveV3EthereumMultiplyPools_2 = [
	'WBTC-DAI',
	'WBTC-USDC',
	'WBTC-USDT',
	'WBTC-LUSD',
	'WBTC-GHO',
	'WBTC-ETH',
];

export const aaveV3EthereumMultiplyPools_3 = [
	'WSTETH-DAI',
	'WSTETH-USDC',
	'WSTETH-USDT',
	'WSTETH-LUSD',
	'WSTETH-GHO',
	'WSTETH-RPL',
];

export const aaveV3EthereumMultiplyPools_4 = [
	'RETH-DAI',
	'RETH-USDC',
	'RETH-USDT',
	'RETH-GHO',
	'WEETH-GHO',
];

export const aaveV3EthereumMultiplyPools_5 = ['CBETH-DAI', 'CBETH-USDC', 'CBETH-GHO', 'LDO-USDT'];

export const aaveV3EthereumMultiplyPools_6 = [
	'LINK-DAI',
	'LINK-USDC',
	'LINK-USDT',
	'LINK-GHO',
	'LINK-ETH',
];

export const aaveV3EthereumMultiplyPools_7 = [
	'DAI-ETH',
	'DAI-MKR',
	'DAI-WBTC',
	'SDAI-WBTC',
	'SDAI-ETH',
];

export const aaveV3EthereumMultiplyPools_8 = ['USDC-ETH', 'USDC-WSTETH', 'USDC-WBTC', 'USDT-ETH'];

export type Tokens =
	| 'CBETH'
	| 'DAI'
	| 'DAI-1'
	| 'DAI-2'
	| 'DAI-3'
	| 'DAI-4'
	| 'ETH'
	| 'ETH-1'
	| 'ETH-2'
	| 'ETH-3'
	| 'EZETH'
	| 'FRAX'
	| 'LDO'
	| 'LINK'
	| 'LUSD'
	| 'MKR'
	| 'OSETH'
	| 'PTWEETH'
	| 'RETH'
	| 'RPL'
	| 'SDAI'
	| 'SUSDE'
	| 'USDA'
	| 'USDE'
	| 'USDC'
	| 'USDT'
	| 'WBTC'
	| 'WEETH'
	| 'WSTETH';

export type SetBalanceTokens =
	| 'CBETH'
	| 'DAI'
	| 'ENA'
	| 'ETH'
	| 'EZETH'
	| 'FRAX'
	| 'GHO'
	| 'LDO'
	| 'LINK'
	| 'LUSD'
	| 'MKR'
	| 'OSETH'
	| 'PYUSD'
	| 'RETH'
	| 'SDAI'
	| 'STETH'
	| 'SUSDE'
	| 'USDC'
	| 'USDE'
	| 'USDT'
	| 'WBTC'
	| 'WEETH'
	| 'WOETH'
	| 'WSTETH'
	| 'YFI';

export const depositAmount = {
	AJNA: '100',
	CBETH: '10',
	DAI: '2000',
	ENA: '4000',
	ETH: '10',
	EZETH: '10',
	FRAX: '2000',
	GHO: '100',
	LDO: '2000',
	LINK: '1000',
	LUSD: '2000',
	MKR: '20',
	OP: '1000',
	OSETH: '10',
	PYUSD: '2000',
	RETH: '10',
	SDAI: '2000',
	STETH: '10',
	SUSDE: '100000',
	TBTC: '100',
	USDC: '2000',
	USDE: '2000',
	USDT: '2000',
	WBTC: '0.1',
	WEETH: '10',
	WETH: '10',
	WOETH: '10',
	WSTETH: '10',
	YFI: '1',
};
