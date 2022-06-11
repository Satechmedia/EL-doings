import { useMemo, useState, useEffect } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';

import { getErrorConnectMessage, injected, walletConnect } from '../connectors';

export const useConnectWallet = () => {
  const { activate, deactivate } = useWeb3React();

  const connect = useMemo(() => {
    return {
      connectInjected(metamaskNotFound?: any, callbackSuccess?: any, callbackError?: any): void {
        injected.isAuthorized().then(async (isAuthorized: boolean) => {
          callbackSuccess && callbackSuccess();
          await activate(injected, undefined, true).catch((error) => {
            callbackError && callbackError();
            getErrorConnectMessage(error, deactivate, metamaskNotFound);
          });
        });
      },

    
      connectWalletConnect() {
        let list : any;
        list = walletConnect.walletConnectProvider;
        if (walletConnect instanceof WalletConnectConnector && list?.wc?.uri) {
          walletConnect.walletConnectProvider = undefined;
        }
        walletConnect &&
          activate(walletConnect, undefined, true).catch(async (error) => {
            getErrorConnectMessage(error, deactivate);
            if (error instanceof UnsupportedChainIdError) {
              await activate(walletConnect, undefined, true).catch((error) => console.log(error, 'error')); // a little janky...can't use setError because the connector isn't set
            }
          });
      },

      connectDeactivate() {
        deactivate();
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activate, deactivate]);

  return connect;
};

export function useWindowResize() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const listener = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  return {
    width,
    height,
  };
}

function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

export const METAMASK_TEXT = 'metamask';

// reaload connect wallet
export const useInactiveListener = (suppress = false) => {
  // const { active, error, activate, deactivate } = useWeb3React();
  // // const { address, isWalletConnect } = useAppSelector(getAddressSlice);
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   const { ethereum } = window;
  //   if (ethereum && ethereum.on && !active && !error && !suppress && address && !isWalletConnect) {
  //     const handleConnect = () => {
  //       activate(injected);
  //     };
  //     const handleChainChanged = (chainIdHex: string) => {
  //       activate(injected);
  //     };
  //     const handleAccountsChanged = (accounts: string) => {
  //       if (accounts.length > 0) {
  //         activate(injected);
  //       }
  //     };
  //     const handleNetworkChanged = (networkId: string) => {
  //       activate(injected);
  //     };
  //     ethereum.on('connect', handleConnect);
  //     ethereum.on('chainChanged', handleChainChanged);
  //     ethereum.on('accountsChanged', handleAccountsChanged);
  //     ethereum.on('networkChanged', handleNetworkChanged);
  //     return () => {
  //       if (ethereum.removeListener) {
  //         ethereum.removeListener('connect', handleConnect);
  //         ethereum.removeListener('chainChanged', handleChainChanged);
  //         ethereum.removeListener('accountsChanged', handleAccountsChanged);
  //         ethereum.removeListener('networkChanged', handleNetworkChanged);
  //       }
  //     };
  //   }
  // }, [active, error, suppress, activate, isWalletConnect]);
  // // Handle listener disconnect event
  // useEffect(() => {
  //   if (isWalletConnect) {
  //     walletConnect.activate();
  //     walletConnect?.on('Web3ReactDeactivate', (data: any) => {
  //       localStorage.removeItem('walletconnect');
  //       if (active) {
  //         deactivate();
  //       }
  //       walletConnect.close();
  //     });
  //   }
  // }, [isWalletConnect]);
};