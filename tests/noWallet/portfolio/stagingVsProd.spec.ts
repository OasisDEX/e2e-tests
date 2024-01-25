import { expect, test } from '#noWalletFixtures';
import { longTestTimeout, portfolioTimeout } from 'utils/config';

test.describe('Staging vs Production - Wallet not connected', async () => {
	/* 
		Overview values -- DONE
		Number of positions -- DONE
		Position types -- TO BE DONE
		Assets -- TO BE DONE
		TO BE ADDED: 0x458F04fEAB592Cd28f29A9926f86292A9Ef20600
			--> This wallet doesn't have any active positions. but has some empty ones
	*/

	const shortenAddress = (address: string) =>
		`${address.slice(0, 6)}...${address.slice(-5)}`.toLowerCase();

	[
		'0x000009818d53763C701bA86586152c667Ac3AcdB',
		'0xae362a72935dac355be989bf490a7d929f88c295',
		'0x29eee8966452208ebd6b1cd047c15bd1aec50e88',
		'0x9C3c6cF9D29Ab9E9e14503dbfC9aD8bB2A0E37EF',
		'0x280dEd1b7e430BeD0Cbb0Aace452Fd2ADEf2b581',
		'0x83664B8a83b9845Ac7b177DF86d0F5BF3b7739AD',
		'0x39Cc77F88C7CFE2139066a7e987746e2Cd3bAd38',
	].forEach((walletAddress) =>
		test(`It should show same info in Portfolio - Staging vs Production - ${shortenAddress(
			walletAddress
		)} @regression`, async ({ app }) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '14090',
			});

			test.setTimeout(longTestTimeout);

			// STAGING - 1st log
			await app.portfolio.open(walletAddress);
			await app.portfolio.shouldHaveWalletAddress({
				address: shortenAddress(walletAddress),
				timeout: portfolioTimeout,
			});
			const stagingData1 = await app.portfolio.getPortfolioData();

			// PRODUCTION
			await app.portfolio.openOnProduction(walletAddress);
			await app.portfolio.shouldHaveWalletAddress({
				address: shortenAddress(walletAddress),
				timeout: portfolioTimeout,
			});
			const productionData = await app.portfolio.getPortfolioData();

			// STAGING - 2nd log (Portfolio data is updated from time to time)
			await app.portfolio.open(walletAddress);
			await app.portfolio.shouldHaveWalletAddress({
				address: shortenAddress(walletAddress),
				timeout: portfolioTimeout,
			});
			const stagingData2 = await app.portfolio.getPortfolioData();

			// Check that productionData is equal to either stagingData1 or stagingData2
			for (const property in productionData) {
				expect([stagingData1[property], stagingData2[property]]).toContain(
					productionData[property]
				);
			}
		})
	);
});
