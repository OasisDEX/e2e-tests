export const wEthContractAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const usdcContractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
export const ajnaPoolAddress = '0x3ba6a019ed5541b5f5555d8593080042cf3ae5f4';

export const sparkEthereumMultiplyPools = [
	'ETH-DAI',
	'RETH-DAI',
	'WSTETH-DAI',
	'WBTC-DAI',
	'SDAI-ETH',
	// 'WEETH-DAI', --> WEETH supply 100%
];

export const sparkEthereumEarnPools = [
	'RETH-ETH',
	'WSTETH-ETH',
	'SDAI-USDC',
	'SDAI-USDT',
	// 'WEETH-ETH', --> WEETH supply 100%
];

export const sparkEthereumBorrowPools = [
	'ETH-DAI',
	'RETH-DAI',
	'WSTETH-DAI',
	'WBTC-DAI',
	'SDAI-ETH',
	// 'WEETH-DAI', --> WEETH supply 100%
];

export const morphoEthereumMultiplyPools = [
	'WSTETH-USDC',
	'WSTETH-USDT',
	'WBTC-USDC',
	'WBTC-USDT',
	'MKR-USDC',
	// 'WSTETH-USDA' --> BUG 15978 - Pool removed for Multiply
];

export const morphoEthereumEarnPools_1 = [
	'flagship-ETH',
	'flagship-USDC',
	'flagship-USDT',
	'steakhouse-ETH',
	'steakhouse-PYUSD',
	'steakhouse-USDC',
	'steakhouse-USDT',
];

export const morphoEthereumEarnPools_2 = [
	'USDE-DAI-1',
	'USDE-DAI-2',
	'USDE-DAI-3',
	'SUSDE-USDT',
	'OSETH-ETH',
];

export const morphoEthereumEarnPools_3 = [
	'WSTETH-ETH-1',
	'WSTETH-ETH-2',
	'WSTETH-ETH-3',
	'WEETH-ETH',
	'WOETH-ETH',
];

export const morphoEthereumEarnPools_4 = ['EZETH-ETH', 'SUSDE-DAI-1', 'SUSDE-DAI-2', 'SUSDE-DAI-3'];

export const morphoEthereumBorrowPools_1 = [
	'USDE-DAI-1',
	'USDE-DAI-2',
	'USDE-DAI-3',
	'OSETH-ETH',
	'EZETH-ETH',
];

export const morphoEthereumBorrowPools_2 = [
	'SUSDE-DAI-1',
	'SUSDE-DAI-2',
	'SUSDE-DAI-3',
	'SUSDE-DAI-4',
	'SUSDE-USDT',
];

export const morphoEthereumBorrowPools_3 = [
	'WSTETH-ETH-1',
	'WSTETH-ETH-2',
	'WSTETH-ETH-3',
	'WSTETH-USDC',
	'WSTETH-USDT',
	'WSTETH-USDA',
];

export const morphoEthereumBorrowPools_4 = [
	'WBTC-USDC',
	'WBTC-USDT',
	'MKR-USDC',
	'RSETH-ETH',
	'WOETH-ETH',
	'WEETH-ETH',
];

export const morphoBaseMultiplyPools = ['CBETH-USDC', 'WSTETH-USDC'];
// , 'WEETH-USDC' --> WEETH supply 100%
// , 'ETH-USDC' --> NO LIQUIDITY

export const morphoBaseEarnPools = [
	'BSDETH-ETH',
	'WSTETH-ETH-2',
	'CBETH-ETH',
	// 'WSTETH-ETH-1',  -- NO LIQUIDITY FOR MOST OF THE POOLS
	// 'EZETH-ETH',
	// 'WEETH-ETH',
];

export const morphoBaseBorrowPools = [
	'BSDETH-ETH',
	'CBETH-ETH',
	'WSTETH-ETH-2',
	'CBETH-USDC',
	'WSTETH-USDC',
	// 'AERO-USDC', -- NO LIQUIDITY
	// 'EZETH-USDC', -- NO LIQUIDITY
	// 'ETH-USDC', -- NO LIQUIDITY
];
export const aaveV3EthereumEarnPools_1 = ['WSTETH-CBETH', 'CBETH-ETH', 'RETH-ETH'];

export const aaveV3EthereumEarnPools_2 = ['SDAI-DAI', 'SDAI-LUSD', 'SDAI-USDC', 'SDAI-USDT'];

export const aaveV3EthereumEarnPools_3 = ['USDC-USDT', 'SDAI-FRAX'];
// 'USDC-GHO', 'SDAI-GHO' -- NO LIQUIDITY - GHO

export const aaveV3EthereumEarnPools_4 = ['SUSDE-USDT', 'SUSDE-USDC', 'SUSDE-DAI'];
// , 'WEETH-ETH' --> WEETH supply 100%

export const aaveV3EthereumMultiplyPools_1 = [
	'ETH-DAI',
	'ETH-USDC',
	'ETH-USDT',
	// 'ETH-GHO', -- NO LIQUIDITY - GHO
	'ETH-WBTC',
];

export const aaveV3EthereumMultiplyPools_2 = [
	'WBTC-DAI',
	'WBTC-USDC',
	'WBTC-USDT',
	'WBTC-LUSD',
	// 'WBTC-GHO', -- NO LIQUIDITY - GHO
	'WBTC-ETH',
];

export const aaveV3EthereumMultiplyPools_3 = [
	'WSTETH-DAI',
	'WSTETH-USDC',
	'WSTETH-USDT',
	'WSTETH-LUSD',
	'WSTETH-RPL',
	// 'WSTETH-GHO', --> skipped as there is no GHO liquidity
];

export const aaveV3EthereumMultiplyPools_4 = [
	'RETH-DAI',
	'RETH-USDC',
	'RETH-USDT',
	// 'RETH-GHO', --> skipped as there is no GHO liquidity
	// 'WEETH-GHO', --> WEETH supply 100%
];

export const aaveV3EthereumMultiplyPools_5 = ['CBETH-DAI', 'CBETH-USDC'];
// 'CBETH-GHO' --> skipped as there is no GHO liquidity
// 'LDO-USDT' --> skipped as tenderly_setErc20Balance is not working with LDO

export const aaveV3EthereumMultiplyPools_6 = [
	'LINK-DAI',
	'LINK-USDC',
	'LINK-USDT',
	'LINK-ETH',
	// 'LINK-GHO', --> skipped as there is no GHO liquidity
];

export const aaveV3EthereumMultiplyPools_7 = [
	'DAI-ETH',
	'DAI-MKR',
	'DAI-WBTC',
	'SDAI-WBTC',
	'SDAI-ETH',
];

export const aaveV3EthereumMultiplyPools_8 = ['USDC-ETH', 'USDC-WSTETH', 'USDC-WBTC', 'USDT-ETH'];

export const aaveV3EthereumBorrowPools_1 = [
	'ETH-DAI',
	'ETH-USDC',
	'ETH-USDT',
	// 'ETH-GHO', -- NO LIQUIDITY - GHO
	'ETH-WBTC',
];

export const aaveV3EthereumBorrowPools_2 = [
	'WBTC-DAI',
	'WBTC-USDC',
	'WBTC-USDT',
	'WBTC-LUSD',
	// 'WBTC-GHO', -- NO LIQUIDITY - GHO
	'WBTC-ETH',
];

export const aaveV3EthereumBorrowPools_3 = [
	'WSTETH-DAI',
	'WSTETH-USDC',
	'WSTETH-USDT',
	'WSTETH-LUSD',
	// 'WSTETH-GHO', -- NO LIQUIDITY - GHO
	'WSTETH-RPL',
	'WSTETH-CBETH',
];

export const aaveV3EthereumBorrowPools_4 = [
	'RETH-DAI',
	'RETH-USDC',
	'RETH-USDT',
	// 'RETH-GHO', -- NO LIQUIDITY - GHO
	'RETH-ETH',
	// 'WEETH-GHO', --> WEETH supply 100%
];

export const aaveV3EthereumBorrowPools_5 = ['CBETH-ETH', 'CBETH-USDC', 'CBETH-GHO'];
// 'LDO-USDT' skipped as tenderly_setErc20Balance is not working with LDO

export const aaveV3EthereumBorrowPools_6 = [
	'LINK-DAI',
	'LINK-USDC',
	'LINK-USDT',
	// 'LINK-GHO', -- NO LIQUIDITY - GHO
	'LINK-ETH',
	'DAI-ETH',
	'DAI-MKR',
	'DAI-WBTC',
];

export const aaveV3EthereumBorrowPools_7 = [
	'SDAI-WBTC',
	'SDAI-ETH',
	'SDAI-USDC',
	'SDAI-USDT',
	'SDAI-LUSD',
	// 'SDAI-GHO', -- NO LIQUIDITY - GHO
	'SDAI-FRAX',
];

export const aaveV3EthereumBorrowPools_8 = [
	'USDC-WBTC',
	'USDC-ETH',
	'USDC-WSTETH',
	'USDC-USDT',
	// 'USDC-GHO', -- NO LIQUIDITY - GHO
	'USDT-ETH',
];

export const aaveV3ArbitrumEarnPools = ['WSTETH-ETH', 'RETH-ETH'];
// 'WEETH-ETH' --> WEETH supply 100%

export const aaveV3ArbitrumMultiplyPools_1 = [
	'ETH-DAI',
	'ETH-USDC',
	'WBTC-DAI',
	'WBTC-USDC',
	// 'WEETH-USDC',  --> WEETH supply 100%
];

export const aaveV3ArbitrumMultiplyPools_2 = ['RETH-DAI', 'RETH-USDC', 'WSTETH-DAI', 'WSTETH-USDC'];

export const aaveV3ArbitrumMultiplyPools_3 = ['DAI-ETH', 'DAI-WBTC', 'USDC-ETH', 'USDC-WBTC'];

export const aaveV3ArbitrumBorrowPools_1 = [
	'ETH-DAI',
	'ETH-USDC',
	'RETH-DAI',
	'RETH-USDC',
	'WSTETH-DAI',
	'WSTETH-USDC',
	'WBTC-DAI',
	'WBTC-USDC',
	// 'WEETH-USDC',  --> WEETH supply 100%
];

export const aaveV3ArbitrumBorrowPools_2 = ['DAI-ETH', 'DAI-WBTC', 'USDC-ETH', 'USDC-WBTC'];

export const aaveV3BaseEarnPools = ['CBETH-ETH', 'WSTETH-ETH'];
// , 'WEETH-ETH'  --> WEETH supply 100%

export const aaveV3BaseMultiplyPools = [
	'ETH-USDC',
	'ETH-USDBC',
	'CBETH-USDC',
	'CBETH-USDBC',
	'WSTETH-USDC',
	// 'WEETH-USDC', --> WEETH supply 100%
];

export const aaveV3BaseBorrowPools = [
	'ETH-USDC',
	'ETH-USDBC',
	'CBETH-USDC',
	'CBETH-USDBC',
	'WSTETH-USDC',
	// 'WEETH-USDC', --> WEETH supply 100%
];

export const aaveV3OptimismEarnPools = ['USDC.E-SUSD', 'USDC-SUSD', 'WSTETH-ETH']; // BUG - 16013

export const aaveV3OptimismMultiplyPools_1 = ['ETH-DAI', 'ETH-USDC', 'ETH-USDC.E', 'WSTETH-DAI'];

export const aaveV3OptimismMultiplyPools_2 = [
	'WSTETH-USDC.E',
	'WBTC-DAI',
	'WBTC-USDC',
	'WBTC-USDC.E',
];

export const aaveV3OptimismMultiplyPools_3 = ['DAI-ETH', 'DAI-WBTC', 'USDC-ETH', 'USDC-WBTC'];

export const aaveV3OptimismMultiplyPools_4 = ['USDC.E-ETH', 'USDC.E-WBTC', 'WSTETH-USDC'];

export const aaveV3OptimismBorrowPools_1 = [
	'ETH-DAI',
	'ETH-USDC',
	'ETH-USDC.E',
	'WSTETH-DAI',
	'WSTETH-USDC',
	'WSTETH-USDC.E',
	'WBTC-DAI',
	'WBTC-USDC',
	'WBTC-USDC.E',
];

export const aaveV3OptimismBorrowPools_2 = [
	'DAI-ETH',
	'DAI-WBTC',
	'USDC-ETH',
	'USDC-WBTC',
	'USDC.E-ETH',
	'USDC.E-WBTC',
];

export const aaveV2EthereumMultiplyPools = ['ETH-USDC', 'WBTC-USDC']; // 'STETH-USDC' skipped - Not able to get funds with 'tenderly_setBalance'

export type Tokens =
	| 'AERO'
	| 'BSDETH'
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
	| 'GHO'
	| 'LDO'
	| 'LINK'
	| 'LUSD'
	| 'MKR'
	| 'OSETH'
	| 'PTWEETH'
	| 'RETH'
	| 'RPL'
	| 'RSETH'
	| 'SDAI'
	| 'SUSDE'
	| 'USDA'
	| 'USDC'
	| 'USDC_E'
	| 'USDE'
	| 'USDT'
	| 'WBTC'
	| 'WEETH'
	| 'WSTETH';

export type SetBalanceTokens =
	| 'AERO'
	| 'BSDETH'
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
	| 'RSETH'
	| 'SDAI'
	| 'STETH'
	| 'SUSDE'
	| 'USDA'
	| 'USDC'
	| 'USDC_E'
	| 'USDE'
	| 'USDT'
	| 'WBTC'
	| 'WEETH'
	| 'WOETH'
	| 'WSTETH'
	| 'YFI';

export const depositAmount = {
	AJNA: '100',
	AERO: '4000',
	BSDETH: '2',
	CBETH: '2',
	DAI: '4000',
	ENA: '4000',
	ETH: '2',
	EZETH: '2',
	FRAX: '4000',
	GHO: '4000',
	LDO: '4000',
	LINK: '1000',
	LUSD: '4000',
	MKR: '2',
	OP: '1000',
	OSETH: '2',
	PYUSD: '4000',
	RETH: '2',
	RSETH: '2',
	SDAI: '4000',
	STETH: '2',
	SUSDE: '4000',
	TBTC: '100',
	USDC: '4000',
	USDC_E: '4000',
	USDE: '4000',
	USDT: '4000',
	WBTC: '0.15',
	WEETH: '2',
	WETH: '2',
	WOETH: '2',
	WSTETH: '2',
	YFI: '1',
};

export const tokenDecimals = {
	CBETH: 10 ** 18,
	ETH: 10 ** 18,
	RETH: 10 ** 18,
	WSTETH: 10 ** 18,
};
