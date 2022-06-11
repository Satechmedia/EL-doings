import React, {
    useState,
    useEffect,
    useImperativeHandle,
    FC,
    forwardRef
  } from 'react';
  import { withTranslation } from 'react-i18next';
  import { Button, Drawer, Layout, Modal, Popover, Space, Spin } from 'antd';
  import { useWeb3React } from '@web3-react/core';
  import { LoadingOutlined } from '@ant-design/icons';
  import { NavLink, useLocation } from 'react-router-dom';
  
  import Logo from "../../resources/images/logo.svg";
  import { useConnectWallet, useWindowResize } from '../../hook';
  import { formatNetworkAddress, storeAddress } from '../../utils/helpers';
  import IconMenu from '../../resources/svg/IconMenu';
  import { socialLinks } from '../../pages/layout/socials';
  import { NETWORK_CHAIN_ID } from '../../common/constant';
  import { walletConnect } from '../../connectors';
  import IconWalletConnect from '../../resources/svg/wallet_connect.svg';
  import IconMetamask from '../../resources/svg/metamask.svg';
  import IconRight from '../../resources/svg/icon_right.svg';
  import loading from '../../resources/svg/loading.svg';
  
  const { Header } = Layout;
  
  const HeaderCommon: FC<any> = forwardRef(({ connectButtonRef }, ref) => {
    const { connectInjected, connectWalletConnect } = useConnectWallet();
    const { error, chainId, account, active, deactivate } = useWeb3React();
    const { width } = useWindowResize();
    const location = useLocation();
  
    const address = localStorage.getItem('address');
    const isWalletConnect = localStorage.getItem('walletconnect');
    const IconLoading = <img src={loading} alt='' />;
  
    const [isConnected, setIsConnected] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isVisibleConnectModal, setIsVisibleConnectModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
  
    const onConnectMetamask = () => {
      setIsConnecting(true);
    };
  
    const onConnectMetamaskSuccess = () => {
      setIsConnecting(false);
    };
  
    const handleConnectMetamask = () => {
      if (
        chainId &&
        ![NETWORK_CHAIN_ID.BSC, NETWORK_CHAIN_ID.RINKEBY].includes(chainId)
      ) {
        setIsModalVisible(true);
        return;
      }
  
      connectInjected(null, onConnectMetamask, onConnectMetamaskSuccess);
      setVisible(false);
    };
  
    const handleConnectWallet = () => {
      connectWalletConnect();
    };
  
    const toggleConnectWalletModal = () => {
      setIsVisibleDrawer(false);
      setIsVisibleConnectModal((prevState: boolean) => !prevState);
    };
  
    const handleDisconnectMetamask = () => {
      localStorage.removeItem('address');
      localStorage.removeItem('walletconnect');
  
      if (active) {
        deactivate();
      }
      if (isWalletConnect) {
        walletConnect.close();
        walletConnect.activate();
      }
    };
  
    const handleVisibleChange = () => {
      setVisible((prevState: boolean) => !prevState);
    };
  
    const handleVisibleDrawer = () => {
      setIsVisibleDrawer((prevState: boolean) => !prevState);
    };
  
    useImperativeHandle(connectButtonRef, () => ({
      triggerClickConnect: () => {
        toggleConnectWalletModal();
      }
    }));
  
    useEffect(() => {
      setIsVisibleDrawer(false);
  
      return () => {
        setIsVisibleDrawer(false);
      };
    }, [location.pathname]);
  
    useEffect(() => {
      setIsConnected(!error && !!chainId);
  
      if (chainId) {
        if (
          [NETWORK_CHAIN_ID.BSC, NETWORK_CHAIN_ID.RINKEBY].includes(chainId)
        ) {
          setIsModalVisible(false);
        } else {
          setIsModalVisible(true);
        }
      }
    }, [error, chainId]);
  
    useEffect(() => {
      if (address && !active) {
        if (isWalletConnect) {
          setTimeout(() => connectWalletConnect(), 700);
        } else {
          setTimeout(() => connectInjected(), 700);
        }
      }
    }, [address, isWalletConnect, active, connectWalletConnect, connectInjected]);
  
    useEffect(() => {
      if (isWalletConnect) {
        walletConnect.activate();
        walletConnect?.on('Web3ReactDeactivate', (data: any) => {
          // TODO: active wallet on reload
          localStorage.removeItem('walletconnect');
          localStorage.removeItem('address');
  
          if (active) {
            deactivate();
          }
          walletConnect.close();
        });
      }
    }, [isWalletConnect, active, deactivate]);
  
    useEffect(() => {
      if (active && account) {
        storeAddress(account);
        setIsVisibleConnectModal(false);
        onConnectMetamaskSuccess();
      }
    }, [account, active]);
  
    useEffect(() => {
      if (width < 575) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }, [width]);
  
    return (
      <Header className='header' id='header'>
        <div className='container'>
          <div className='header__left'>
            <img src={Logo} alt='ShoeFy Vesting Portal' />
          </div>
  
          <div className='header__right'>
            {!isMobile && (
              <>
                {!isConnected && (
                  <Button type='primary' onClick={toggleConnectWalletModal}>
                    Connect to <span className='wallet'>wallet</span>
                  </Button>
                )}
                {isConnected && (
                  <Popover
                    content={
                      <Button
                        type='primary'
                        onClick={handleDisconnectMetamask}
                        className='button-disconnect'
                      >
                        Disconnect
                      </Button>
                    }
                    trigger='click'
                    visible={visible}
                    onVisibleChange={handleVisibleChange}
                    placement='bottom'
                    getPopupContainer={() =>
                      document.getElementById('header') as HTMLElement
                    }
                  >
                    <Button className='button-connected'>
                      {account && formatNetworkAddress(account)}
                    </Button>
                  </Popover>
                )}
              </>
            )}
            {isMobile && (
              <Button
                icon={<IconMenu />}
                className='button-menu'
                onClick={handleVisibleDrawer}
              />
            )}
          </div>
        </div>
        <Drawer
          title={null}
          placement='right'
          width='100%'
          onClose={handleVisibleDrawer}
          visible={isVisibleDrawer}
          closable={false}
          className='drawer'
        >
          <div className='header'>
            <div className='header__left'>
              <img src={Logo} alt='ShoeFy Vesting Portal' />
            </div>
  
            <div className='header__right'>
              <Button
                icon={<IconMenu />}
                className='button-menu'
                onClick={handleVisibleDrawer}
              />
            </div>
          </div>
          <div className='body'>
            {!isConnected && (
              <Button type='primary' onClick={toggleConnectWalletModal}>
                Connect to <span className='wallet'>wallet</span>
              </Button>
            )}
            {isConnected && (
              <>
                <Button className='button-connected'>
                  {account && formatNetworkAddress(account)}
                </Button>
                <Button
                  type='primary'
                  onClick={handleDisconnectMetamask}
                  className='button-disconnect'
                >
                  Disconnect
                </Button>
              </>
            )}
          </div>
          <div className='drawer__footer container'>
            <ul className='social'>
              {socialLinks.map(({ name, icon, link }: any) => (
                <li className='social__icon' key={name}>
                  <a href={link} target='_blank' rel='noopener noreferrer'>
                    <img src={icon} alt={name} />
                  </a>
                </li>
              ))}
            </ul>
            <p>BF Network. All right reserved.</p>
          </div>
        </Drawer>
        <Modal
          title={null}
          visible={isModalVisible}
          footer={null}
          width={544}
          closable={false}
          className='wrong-network-modal'
        >
          <Spin indicator={IconLoading} />
          <h2 className='title'>
            Wrong <span>Network</span>
          </h2>
          <div className='description'>Please change network on your wallet</div>
          <Button className='switch-btn'>Switch to BSC TESTNET</Button>
        </Modal>
  
        <Modal
          title={null}
          visible={isVisibleConnectModal}
          footer={null}
          width={544}
          closable={true}
          onCancel={toggleConnectWalletModal}
          className='connect-wallet-modal'
        >
          <h2 className='title'>
            Connect <span>Wallet</span>
          </h2>
          <div className='description'>
            Please connect your wallet to continue. <br />
            The system supports the following wallets
          </div>
          <Space direction='vertical' size='middle'>
            <Button onClick={handleConnectMetamask} disabled={isConnecting}>
              <span>
                <img src={IconMetamask} alt='Metamask' className='icon__left' />
                <span>Metamask</span>
                <img src={IconRight} alt='right' className='icon__right' />
              </span>
            </Button>
            <Button onClick={handleConnectWallet} disabled={isConnecting}>
              <span>
                <img
                  src={IconWalletConnect}
                  alt='Wallet Connect'
                  className='icon__left'
                />
                <span>WalletConnect</span>
                <img src={IconRight} alt='right' className='icon__right' />
              </span>
            </Button>
          </Space>
        </Modal>
      </Header>
    );
  });
  export default withTranslation()(HeaderCommon);