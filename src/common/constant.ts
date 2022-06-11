import { randomRPCTesnet } from '../utils/helpers';

export const POLLING_INTERVAL = 10000;

export const TOKEN_ADDRESS = '0xC8037B53423daCCae4b95E1ba132A66aCa82EAa3';

export const DECIMAL_SCALE = 2;

export const TYPE_OF_ANT_DESIGN = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  IMG_DONE: 'done',
};

const LIST_BSC_TESTNET = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-2-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s2.binance.org:8545/',
  'https://data-seed-prebsc-2-s2.binance.org:8545/',
  'https://data-seed-prebsc-1-s3.binance.org:8545/',
  'https://data-seed-prebsc-2-s3.binance.org:8545/',
];

export const LIST_NETWORK_RPC_TESTNET: any = {
  97: randomRPCTesnet(LIST_BSC_TESTNET),
  80001: 'https://rpc-mumbai.maticvigil.com/',
  4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
};

export const LIST_NETWORK_RPC_MAINNET: any = {
  56: 'https://bsc-dataseed.binance.org/',
  137: 'https://rpc-mainnet.maticvigil.com/',
  1: 'https://mainnet.infura.io/v3/50f6131e95134c0fba1a009b561a31d9',
};

export const NETWORK_CHAIN_ID = {
  // ETHEREUM: 1,
  RINKEBY: 4,
  BSC: 56,
};

export const METAMASK_DEEPLINK = 'https://metamask.io/download';
export const BRIDGE_URL = 'https://pancakeswap.bridge.walletconnect.org';
export const NETWORK_URL_BSC = 'https://bsc-dataseed.binance.org/';
