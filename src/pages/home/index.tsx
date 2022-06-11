import React, { useState, FC } from 'react';
import { Button, Col, Layout, Row, Space, Switch, Image } from 'antd';

import { useWeb3React } from '@web3-react/core';
import { RoundComponent, SummaryRoundComponent } from '../../components/Round';
import listRound from './listRound';
import TextLogo from '../../resources/images/text_logo.svg';
import Banner from "../../resources/images/banner.png";
import { socialLinks } from '../layout/socials';

const HomePage: FC<any> = ({ connectButtonRef }) => {
  const { account } = useWeb3React();

  const [isInvested, setIsInvested] = useState(false);
  const [listRoundVisible, setListRoundVisible] = useState(
    listRound.map(({ key }) => key)
  ) as any;

  const [summaryData, setSummaryData] = useState({}) as any;

  const handleChange = (value: boolean) => {
    setIsInvested(value);
  };

  const toggleConnectWalletModal = () => {
    connectButtonRef.current.triggerClickConnect();
  };

  const updateAllData = (data: any) => {
    const {
      index,
      allocationAmount,
      claimedAmount,
      availableAmount,
      claimableAmount
    } = data;
    setSummaryData((prevState: any) => ({
      ...prevState,
      [index]: {
        allocationAmount: allocationAmount || 0,
        claimedAmount: claimedAmount || 0,
        availableAmount: availableAmount || 0,
        claimableAmount: claimableAmount || 0
      }
    }));
  };

  return (
    <Layout className={`home ${account && 'logined'}`}>
      {!account && (
        <div className='banner banner-guest'>
          <div className='container'>
            <Row gutter={[81, 0]} align='middle'>
              <Col className='col--image' span={24} xxl={12}>
                <Image preview={false} src={Banner} alt='beyondFi' />
              </Col>
              <Col span={24} xxl={12} className='col--text'>
                <Image preview={false} src={TextLogo} alt='beyondFi' />
                <h5 className='description'>Vesting Portal</h5>
                <p>
                  A gateway to limitless access, limitless markets, limitless
                  network
                </p>
                <Button type='primary' onClick={toggleConnectWalletModal}>
                  Connect to <span className='wallet'>wallet</span>
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}
      {account && (
        <>
          <div className='banner'>
            <div className='container'>
              <Row>
                <Col>
                  <SummaryRoundComponent account={account} data={summaryData} />
                </Col>
              </Row>
            </div>
          </div>
          <div className='section section-details'>
            <div className='background-white'>
              <div className='container'>
                <h4 className='title'>Vesting Round Detail</h4>
              </div>
              {/* <Space size={12} className='switch'>
                  <Switch
                    checked={isInvested}
                    onChange={handleChange}
                    disabled={!account}
                  />
                  <span className='switch__label'>Invested only</span>
                </Space> */}
              <Row gutter={[20, 0]} className='list-round'>
                {listRound.map((item: any, index: number) => (
                  <Col
                    xs={24}
                    key={index}
                    hidden={isInvested && !listRoundVisible.includes(item.key)}
                  >
                    <RoundComponent
                      title={item.title}
                      isCountdown={item.isCountdown}
                      updateAllData={updateAllData}
                      index={index}
                      setListRoundVisible={setListRoundVisible}
                      keyItem={item.key}
                      {...item}
                    />
                  </Col>
                ))}
              </Row>

              <div className='wrapper bottom-col'>
                <div className='container'>
                  <Row align='middle' justify='space-between'>
                    <Col xs={24} sm={12}>
                      <Space size={24}>
                        {socialLinks.map(({ name, icon, link }: any) => (
                          <a
                            href={link}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <img src={icon} alt={name} />
                          </a>
                        ))}
                      </Space>
                    </Col>

                    <Col xs={24} sm={12}>
                      <p>BF Network. All right reserved.</p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};
export default HomePage;
