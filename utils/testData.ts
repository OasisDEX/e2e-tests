export const wEthContractAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const usdcContractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
export const ajnaPoolAddress = '0x3ba6a019ed5541b5f5555d8593080042cf3ae5f4';

export const morphoEthereumMultiplyPages_1 = [
	'/ethereum/morphoblue/multiply/WSTETH-USDC#setup',
	'/ethereum/morphoblue/multiply/WSTETH-USDT#setup',
	// '/ethereum/morphoblue/multiply/WSTETH-USDA#setup', - BUG 15978 - Pool should be removed for Multiply
	'/ethereum/morphoblue/multiply/WBTC-USDC#setup',
	'/ethereum/morphoblue/multiply/WBTC-USDT#setup',
];

export const morphoEthereumMultiplyPages_2 = [
	'/ethereum/morphoblue/multiply/USDE-DAI-1#setup',
	'/ethereum/morphoblue/multiply/USDE-DAI-2#setup',
	'/ethereum/morphoblue/multiply/USDE-DAI-3#setup',
	'/ethereum/morphoblue/multiply/SUSDE-USDT#setup',
	'/ethereum/morphoblue/multiply/OSETH-ETH#setup',
];

export const morphoEthereumMultiplyPages_3 = [
	'/ethereum/morphoblue/multiply/WSTETH-ETH-1#setup',
	'/ethereum/morphoblue/multiply/WSTETH-ETH-2#setup',
	'/ethereum/morphoblue/multiply/WSTETH-ETH-3#setup',
	'/ethereum/morphoblue/multiply/WEETH-ETH#setup',
	'/ethereum/morphoblue/multiply/WOETH-ETH#setup',
];

export const morphoEthereumMultiplyPages_4 = [
	'/ethereum/morphoblue/multiply/MKR-USDC#setup',
	'/ethereum/morphoblue/multiply/EZETH-ETH#setup',
	'/ethereum/morphoblue/multiply/SUSDE-DAI-1#setup',
	'/ethereum/morphoblue/multiply/SUSDE-DAI-2#setup',
	'/ethereum/morphoblue/multiply/SUSDE-DAI-3#setup',
];

export const aaveV3EthereumMultiplyPages_1 = [
	'/ethereum/aave/v3/multiply/ETH-DAI#setup',
	'/ethereum/aave/v3/multiply/ETH-USDC#setup',
	'/ethereum/aave/v3/multiply/ETH-USDT#setup',
	'/ethereum/aave/v3/multiply/ETH-GHO#setup',
	'/ethereum/aave/v3/multiply/ETH-WBTC#setup',
];

export const aaveV3EthereumMultiplyPages_2 = [
	'/ethereum/aave/v3/multiply/WBTC-DAI#setup',
	'/ethereum/aave/v3/multiply/WBTC-USDC#setup',
	'/ethereum/aave/v3/multiply/WBTC-USDT#setup',
	'/ethereum/aave/v3/multiply/WBTC-LUSD#setup',
	'/ethereum/aave/v3/multiply/WBTC-GHO#setup',
	'/ethereum/aave/v3/multiply/WBTC-ETH#setup',
];

export const aaveV3EthereumMultiplyPages_3 = [
	'/ethereum/aave/v3/multiply/WSTETH-DAI#setup',
	'/ethereum/aave/v3/multiply/WSTETH-USDC#setup',
	'/ethereum/aave/v3/multiply/WSTETH-USDT#setup',
	'/ethereum/aave/v3/multiply/WSTETH-LUSD#setup',
	'/ethereum/aave/v3/multiply/WSTETH-GHO#setup',
	'/ethereum/aave/v3/multiply/WSTETH-RPL#setup',
];

export const aaveV3EthereumMultiplyPages_4 = [
	'/ethereum/aave/v3/multiply/RETH-DAI#setup',
	'/ethereum/aave/v3/multiply/RETH-USDC#setup',
	'/ethereum/aave/v3/multiply/RETH-USDT#setup',
	'/ethereum/aave/v3/multiply/RETH-GHO#setup',
	'/ethereum/aave/v3/multiply/WEETH-GHO#setup',
];

export const aaveV3EthereumMultiplyPages_5 = [
	'/ethereum/aave/v3/multiply/CBETH-DAI#setup',
	'/ethereum/aave/v3/multiply/CBETH-USDC#setup',
	'/ethereum/aave/v3/multiply/CBETH-GHO#setup',
	'/ethereum/aave/v3/multiply/LDO-USDT#setup',
];

export const aaveV3EthereumMultiplyPages_6 = [
	'/ethereum/aave/v3/multiply/LINK-DAI#setup',
	'/ethereum/aave/v3/multiply/LINK-USDC#setup',
	'/ethereum/aave/v3/multiply/LINK-USDT#setup',
	'/ethereum/aave/v3/multiply/LINK-GHO#setup',
	'/ethereum/aave/v3/multiply/LINK-ETH#setup',
];

export const aaveV3EthereumMultiplyPages_7 = [
	'/ethereum/aave/v3/multiply/DAI-ETH#setup',
	'/ethereum/aave/v3/multiply/DAI-MKR#setup',
	'/ethereum/aave/v3/multiply/DAI-WBTC#setup',
	'/ethereum/aave/v3/multiply/SDAI-WBTC#setup',
	'/ethereum/aave/v3/multiply/SDAI-ETH#setup',
];

export const aaveV3EthereumMultiplyPages_8 = [
	'/ethereum/aave/v3/multiply/USDC-ETH#setup',
	'/ethereum/aave/v3/multiply/USDC-WSTETH#setup',
	'/ethereum/aave/v3/multiply/USDC-WBTC#setup',
	'/ethereum/aave/v3/multiply/USDT-ETH#setup',
];

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
