export type walletTypes = 'MetaMask' | 'WalletConnect';

export type EarnTokens =
	| 'CBETH'
	| 'cbETH'
	| 'COMP'
	| 'DAI'
	| 'ETH'
	| 'EURC'
	| 'LVUSDC'
	| 'LVUSDT'
	| 'MORPHO'
	| 'USDBC'
	| 'USDbC'
	| 'USDC'
	| 'USDC.E'
	| 'USDC.e'
	| 'USDS'
	| 'USDT'
	| 'USD₮0'
	| 'WBTC'
	| 'WETH'
	| 'WSTETH'
	| 'wstETH';

export type LvTokens = 'LVEURC' | 'LVWETH' | 'LVUSDC' | 'LVUSDCe' | 'LVUSDT';

export type LazyNominatedTokens = 'ETH' | 'EURC' | 'USDC' | 'USDC.E' | 'USDT' | 'USD₮0';

export type RiskLevels = 'Lower Risk' | 'Higher Risk';

export type RiskManagementTypes = 'Risk-Managed by BlockAnalitica' | 'DAO Risk-Managed';

export type Networks = 'arbitrum' | 'base' | 'ethereum' | 'hyperliquid' | 'sonic';

export type AssetsSelectorOptions =
	| 'All assets'
	| 'All stables'
	| 'ETH'
	| 'EURC'
	| 'USDC'
	| 'USDC.E'
	| 'USDT';

export type VaultTypes = 'DeFi Vaults' | 'Permissioned RWA Vaults';

export type EarnFilters =
	| { filter: 'assets'; asset: AssetsSelectorOptions }
	| { filter: 'networks'; network: Networks }
	| { filter: 'riskManagementTypes'; riskManagementType: RiskManagementTypes }
	| { filter: 'vaultTypes'; vaultType: VaultTypes };
