import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';
import { comparePositionsData, shortenAddress } from 'utils/general';
import { PortfolioData } from 'src/pages/portfolio';

test.describe('Staging vs Production - Wallet not connected', async () => {
	/* 
		Overview values -- DONE
		Number of positions -- DONE
		Position types and pools -- DONE
		Assets -- TO BE DONE
	*/

	[
		'0x9C3c6cF9D29Ab9E9e14503dbfC9aD8bB2A0E37EF',
		'0x000009818d53763C701bA86586152c667Ac3AcdB',
		'0xae362a72935dac355be989bf490a7d929f88c295',
		'0x280dEd1b7e430BeD0Cbb0Aace452Fd2ADEf2b581',
		'0x83664B8a83b9845Ac7b177DF86d0F5BF3b7739AD',
		'0x39Cc77F88C7CFE2139066a7e987746e2Cd3bAd38',
		'0xb0a5f41a36de795bb102dc41f4c61c6956144282',
		'0xdd9e07372dc5368c9c0633222b0f1c4335500ef7',
		'0x2079c29be9c8095042edb95f293b5b510203d6ce',
		'0xee2826453a4fd5afeb7ceffeef3ffa2320081268',
		'0x554fe9292cd2e2b9469e19e814842c060312ff00',
		'0x8e83fab54c595ee085111ae498c8bbca8c8b2c92',
	].forEach((walletAddress) =>
		test(`It should show same info in Portfolio - Staging vs Production - ${shortenAddress(
			walletAddress
		)} @regression`, async ({ app }) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '14090',
			});

			test.setTimeout(longTestTimeout);

			let stagingData: PortfolioData;
			let productionData: PortfolioData;

			// STAGING
			await app.portfolio.loadPortfolioPageAndPositions({ environment: 'staging', walletAddress });
			await app.portfolio.positionsHub.showEmptyPositions();
			await app.portfolio.shouldHaveViewingWalletBanner(shortenAddress(walletAddress));
			stagingData = await app.portfolio.getPortfolioData();

			// PRODUCTION
			await app.portfolio.loadPortfolioPageAndPositions({
				environment: 'production',
				walletAddress,
			});
			await app.portfolio.positionsHub.showEmptyPositions();
			await app.portfolio.shouldHaveViewingWalletBanner(shortenAddress(walletAddress));
			productionData = await app.portfolio.getPortfolioData();

			for (const property in productionData) {
				if (property === 'positionsListedData') {
					expect(
						comparePositionsData(
							stagingData.positionsListedData,
							productionData.positionsListedData
						)
					).toBeTruthy();
				} else {
					if (stagingData[property] !== 0 && stagingData[property] !== 0) {
						const diff =
							((stagingData[property] - productionData[property]) / stagingData[property]) * 100;
						expect(Math.abs(diff)).toBeLessThan(0.15);
					}
				}
			}
		})
	);
});
