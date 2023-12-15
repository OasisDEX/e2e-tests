declare namespace NodeJS {
	interface ProcessEnv {
		NETWORK: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
		WALLET_ADDRESS: string;
	}
}
