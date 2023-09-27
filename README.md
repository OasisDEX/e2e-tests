
# Repository with E2E tests for Summer.fi DeFi web application

## Introduction
This repository contains a repository of tests for the e2e testing of the Summer.fi DeFi web application.

There are two main categories of e2e tests:
- **No wallet**: 
Tests without a wallet connected. 
- **With wallet**: 
Tests with a wallet (and a Tenderly fork) connected.

The tests and framework have been written using Playwright and Typescript. 
- These 'No wallet' tests use Playwright only.
- The 'With wallet' tests use Playwright, Synpress (for Metamask wallet) and Tenderly APIs (for forks).

## Installation
First, install the programs required to run the application:

- [Node.js](https://nodejs.org/en/download/)


Next, clone this repository:
```
git clone https://github.com/OasisDEX/e2e-tests.git
```

Go to the repo directory and install the dependencies:
```
yarn install
```


## Environment variables
To run the tests locally you will need to create a `.env` file. You can create a copy from `.env.example` file by running: 
```
cp .env.example .env
```

The following environment variable is **mandatory** for both all tests:

| Variable | Description |
| --- | --- |
| BASE_URL | This is the base url used to run the tests. As per `.env.example` file, you'll probably use `https://staging.summer.fi` as base url|

The following environment variables are **mandatory** for **with wallet** tests:

| Variable | Description |
| --- | --- |
| WALLET_ADDRESS | You'll need to use a test wallet for running the tests. |
| TENDERLY_PROJECT | Your project in Tenderly. Or create a new one. |
| TENDERLY_USER | Your user in Tenderly. Or create a new one. |
| TENDERLY_ACCESS_KEY | Your access key in Tenderly. Create one if you don't have any. |

You can also use these other environment variables:

| Variable | Default | Description |
| --- | --- | -- |
| FULLY_PARALLEL | false | Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time. By default, **test files** are run in parallel. However, tests in a single file are run in order, in the same worker process. You can configure entire test run to concurrently execute all tests in all files using this option. Note that **with wallet** tests can run **only** serial mode, so this variable will be applied only to **no wallet tests**. |
| WORKERS | 1 | Number of workers used to run the tests. To run the tests in pralallel you need to use more than 1 workers. Note that **with wallet** tests can run **only** with 1 worker, so this variable will be applied only to **no wallet tests**. |
| TIMEOUT | 30000 | Timeout for each test in milliseconds. Note that some timeouts have been defined in `./utils/config.ts` file, so this TIMEOUT variable might not have any effect in some cases. |
| RETRIES | 0 | The maximum number of retry attempts given to failed tests. By default failing tests are not retried. |
| HEADLESS | true | Whether to run browser in headless mode. Note that **with wallet** tests can run **only** in headed mode, so this variable will be applied only to **no wallet tests**. |
| ENABLE_FLAGS | '' | You can pass one or more flags to enable hidden features in staging and dev environments. To pass more than one flag separate them with an empty space: `'flag1 flag2'` |

## Browsers
For now the tests have been setup so that they run only on desktop Chrome.

## Running the tests
**Note** that in oder to considerably reduce the test execution time, several scripts have been created so that **with wallet** tests can be run in parallel jobs (docker containers) in GitHub actions.

1. Create `.env` file.

2. Set `BASE_URL` in `.env` file. For example,  `BASE_URL='https://staging.summer.fi'`.
For running **with wallet** tests also set `WALLET_ADDRESS`, `TENDERLY_PROJECT`, `TENDERLY_USER` and `TENDERLY_ACCESS_KEY` variables.

3. Run tests by running:
- Run all tests:
`yarn test:e2e`
- Run all **regression** tests:
`yarn test:e2e:regression`
- Run **no wallet** tests:
`yarn no-wallet`
- Run **no wallet regression** tests:
`yarn no-wallet:regression`
- Run **with wallet** tests:
`yarn with-wallet:all`
- Run **with wallet regression** tests:
`yarn with-wallet:all:regression`

## Running the tests report
After running one or more tests you can run the following commands to open one or more test reports in the browser:
- `yarn test:report:no-wallet`
- `yarn test:report:with-wallet:aave:ethereum`
- `yarn test:report:with-wallet:aave:arbitrum-and-optimism`
- `yarn test:report:with-wallet:maker-and-spark`  

## Tags 
Tests can be tagged so that we  can only run the tests that have the certain tag. 
At the moment we are using the following tags:
- `@regression`: Add this tag to all the tests that should be part of the regression test suite.

## Projects
A project is a logical group of tests running with the same configuration. For now we are using projects so that we can achieve the two following goals:
- Applying different configuration to **no wallet** and **with wallet** tests.
- Splitting **with wallet** tests so that they can run in parallel containers, and so reducing significantly the test execution time.

At the moment we are using the following projects:
- `no-wallet`
- `with-wallet-aave-arbitrum-and-optimism'`
- `with-wallet-aave-ethereum`
- `with-wallet-maker-and-spark`