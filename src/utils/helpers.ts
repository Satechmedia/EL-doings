import BigNumber from 'bignumber.js';

import { BigNumberish, formatFixed } from '@ethersproject/bignumber';

const names = ['wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether'];

export const formatNetworkAddress = (address = '') => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const storeAddress = (address: string | null | undefined) => {
  if (!address) {
    return;
  }
  return localStorage.setItem('address', address);
};

export const convertEToNumber = (value: any, number: any) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });

  return new BigNumber(value).toNumber() / new BigNumber(10).pow(number).toNumber();
};

export const toNumber = (value?: string | null) => {
  if (!value) {
    return 0;
  }

  return new BigNumber(value).toNumber();
};

export function formatUnits(value: BigNumberish, unitName?: string | BigNumberish): string {
  if (typeof unitName === 'string') {
    const index = names.indexOf(unitName);
    if (index !== -1) {
      unitName = 3 * index;
    }
  }
  return formatFixed(value, unitName != null ? unitName : 18);
}

export const randomRPCTesnet = (listRPC: any) => {
  const lengthList = listRPC?.length;
  const randomNumber = Math.floor(Math.random() * 10) % lengthList;
  return listRPC[randomNumber];
};
