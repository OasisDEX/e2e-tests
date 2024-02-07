import { expect, test } from '#noWalletFixtures';
import { longTestTimeout, portfolioTimeout } from 'utils/config';
import { comparePositionsData, shortenAddress } from 'utils/general';

test.describe('Staging vs Production - Wallet not connected', async () => {
	/* 
		Overview values -- DONE
		Number of positions -- DONE
		Position types and pools -- DONE
		Assets -- TO BE DONE
	*/

	[
		'0x458F04fEAB592Cd28f29A9926f86292A9Ef20600',
		'0x9C3c6cF9D29Ab9E9e14503dbfC9aD8bB2A0E37EF',
		'0x000009818d53763C701bA86586152c667Ac3AcdB',
		'0xae362a72935dac355be989bf490a7d929f88c295',
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
			await app.portfolio.loadPortfolioPageAndPositions({ environment: 'staging', walletAddress });
			await app.portfolio.positions.showEmptyPositions();
			await app.portfolio.shouldHaveViewingWalletBanner(shortenAddress(walletAddress));
			const stagingData1 = await app.portfolio.getPortfolioData();

			// PRODUCTION
			await app.portfolio.loadPortfolioPageAndPositions({
				environment: 'production',
				walletAddress,
			});
			await app.portfolio.positions.showEmptyPositions();
			await app.portfolio.shouldHaveWalletAddress({
				address: shortenAddress(walletAddress),
				timeout: portfolioTimeout,
			});
			const productionData = await app.portfolio.getPortfolioData();

			// STAGING - 2nd log (Portfolio data is updated from time to time)
			await app.portfolio.loadPortfolioPageAndPositions({ environment: 'staging', walletAddress });
			await app.portfolio.positions.showEmptyPositions();
			await app.portfolio.shouldHaveWalletAddress({
				address: shortenAddress(walletAddress),
				timeout: portfolioTimeout,
			});
			const stagingData2 = await app.portfolio.getPortfolioData();

			// Check that productionData is equal to either stagingData1 or stagingData2
			for (const property in productionData) {
				if (property === 'positionsListedData') {
					expect(
						comparePositionsData(
							stagingData1.positionsListedData,
							productionData.positionsListedData
						) ||
							comparePositionsData(
								stagingData2.positionsListedData,
								productionData.positionsListedData
							)
					).toBeTruthy();
				} else {
					expect([stagingData1[property], stagingData2[property]]).toContain(
						productionData[property]
					);
				}
			}
		})
	);
});
