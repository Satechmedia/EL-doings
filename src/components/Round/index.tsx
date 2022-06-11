import React, { useState, useEffect, FC } from 'react';
import { Button, Col, Row, Space } from 'antd';
import classnames from 'classnames';
import Countdown, { zeroPad } from 'react-countdown';
import { getContract } from '../../hook';
import { useWeb3React } from '@web3-react/core';
import { uniq } from 'lodash';
import BigNumber from 'bignumber.js';
import StatisticComponent from '../Statistic';
import { convertEToNumber, formatUnits, toNumber } from '../../utils/helpers';
import { TOKEN_ADDRESS, TYPE_OF_ANT_DESIGN } from '../../common/constant';
import showMessage from '../Message';
import TokenJSON from '../../contracts/abiToken.json';

BigNumber.config({
  EXPONENTIAL_AT: 100
});

const convertHexToDecimal = (value: any) => {
  if (!value) {
    return '0';
  }

  const newValue = new BigNumber(value.toString())
    .dividedBy(Math.pow(10, 18))
    .toString();

  return newValue;
};

const sumTwoNumber = (a: number | string | null, b: number | string | null) => {
  return new BigNumber(a || 0).plus(b || 0).toString();
};

const minusTwoNumber = (
  a: number | string | null,
  b: number | string | null
) => {
  return new BigNumber(a || 0).minus(b || 0).toString();
};

const SummaryRoundComponent: FC<{
  account: null | undefined | string;
  data: any;
}> = ({ account, data }) => {
  const [totalValue, setTotalValue] = useState({}) as any;

  useEffect(() => {
    const newTotalValue = Object.values(data).reduce(
      (acc: any, cur: any) => ({
        allocationAmount: sumTwoNumber(
          acc.allocationAmount,
          cur.allocationAmount
        ),
        claimedAmount: sumTwoNumber(acc.claimedAmount, cur.claimedAmount),
        availableAmount: sumTwoNumber(acc.availableAmount, cur.availableAmount),
        claimableAmount: sumTwoNumber(acc.claimableAmount, cur.claimableAmount)
      }),
      {
        allocationAmount: 0,
        claimedAmount: 0,
        availableAmount: 0,
        claimableAmount: 0
      }
    );
    setTotalValue(newTotalValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, data]);

  return (
    <Row gutter={[56, {
      xs: 40,
      sm: 40,
      md: 64
    }]}>
      <Col span={24}>
        <h4 className='title'>Vesting Portal</h4>
        <h5 className='subtitle'>
          Your CKT <span className='highlight'>Summary</span>
        </h5>
      </Col>
      <Col xs={24} md={12}>
        <StatisticComponent
          percent={totalValue.allocationAmount}
          isConnected={!!account}
          title='Allocation Amount'
          index='01'
        />
      </Col>
      <Col xs={24} md={12}>
        <StatisticComponent
          percent={totalValue.availableAmount}
          isConnected={!!account}
          title='Available Amount'
          index='02'
        />
      </Col>
      <Col xs={24} md={12}>
        <StatisticComponent
          percent={totalValue.claimedAmount}
          isConnected={!!account}
          title='Claimed Amount'
          index='03'
        />
      </Col>
      <Col xs={24} md={12}>
        <StatisticComponent
          percent={totalValue.claimableAmount}
          isConnected={!!account}
          title='Claimable Amount'
          index='04'
        />
      </Col>
    </Row>
  );
};

const RoundComponent: FC<{
  updateAllData: any;
  title?: string;
  isCountdown?: null | undefined | number;
  address: string;
  abi?: any;
  communityRound?: boolean;
  index?: number;
  setListRoundVisible?: any;
  keyItem?: number;
}> = ({
  updateAllData,
  title = '',
  isCountdown = false,
  address,
  abi,
  communityRound,
  index,
  setListRoundVisible,
  keyItem
}) => {
  const { account, library } = useWeb3React();

  const [roundData, setRoundData] = useState({
    allocationAmount: null,
    claimedAmount: null,
    claimableAmount: null,
    availableAmount: null
  });
  const [isShowBtnClaim, setIsShowBtnClaim] = useState(false);

  const [timeCountdown, setTimeCountdown] = useState(0);
  const [isBtnClaim, setBtnClaim] = useState(false);

  const rendererCountdown = ({ days, hours, minutes, seconds }: any) => {
    return (
      <ul className='countdown'>
        <li className='time'>
          <span className={classnames('value', { highlight: days })}>
            {zeroPad(days)}
          </span>
          <span className='unit'>Days</span>
        </li>
        <li className='time'>
          <span className={classnames('value', { highlight: days || hours })}>
            {zeroPad(hours)}
          </span>
          <span className='unit'>Hours</span>
        </li>
        <li className='time'>
          <span
            className={classnames('value', {
              highlight: days || hours || minutes
            })}
          >
            {zeroPad(minutes)}
          </span>
          <span className='unit'>Minutes</span>
        </li>
        <li className='time'>
          <span
            className={classnames('value', {
              highlight: days || hours || minutes || seconds
            })}
          >
            {zeroPad(seconds)}
          </span>
          <span className='unit'>Seconds</span>
        </li>
      </ul>
    );
  };

  /**
   * get Balance
   * @returns balance
   */
  const getBalance = async (
    library: any,
    address: string,
    tokenAddress: string
  ) => {
    const tokenInst = getContract(tokenAddress, TokenJSON, library);
    if (address) {
      const balance = await tokenInst.balanceOf(address);
      const decimals = await tokenInst.decimals();

      return {
        balance: convertEToNumber(formatUnits(balance, 'wei'), decimals)
      };
    } else {
      return {
        balance: 0
      };
    }
  };

  const claimRound = async () => {
    setIsShowBtnClaim(true);

    const { balance } = await getBalance(library, address, TOKEN_ADDRESS);

    if (balance < (roundData?.claimableAmount || 0)) {
      showMessage(
        TYPE_OF_ANT_DESIGN.ERROR,
        'The claiming contract runs out of SHOE, please contact the Shoefy administrators.'
      );

      setIsShowBtnClaim(false);
      return;
    }

    try {
      const contract = getContract(address, abi, library, account as string);
      const res = await contract.unlock(account);
      const receipt = await library.waitForTransaction(res.hash);
      if (receipt.status) {
        getAllData();
      }
      setIsShowBtnClaim(false);
    } catch (err) {
      setIsShowBtnClaim(false);
    }
  };

  const handleComplete = () => {
    setTimeCountdown(0);
    setBtnClaim(true);
  };

  const getAllData = async () => {
    try {
      const contract = getContract(address, abi, library, account as string);
      const lockedAmount = await contract.lockedAmountOf(account);
      const data = await Promise.all([
        contract.lockedAmountOf(account),
        contract.releasedAmountOf(account)
      ]);
      let claimableAmount = 0;
      try {
        claimableAmount = (await lockedAmount.gt(0))
          ? await contract.canUnlockAmountOf(account)
          : 0;
      } catch (ex) {
        claimableAmount = 0;
      }
      const [allocationAmount, claimedAmount] = data;
      const availableAmount = minusTwoNumber(
        convertHexToDecimal(allocationAmount),
        convertHexToDecimal(claimedAmount)
      );

      const newData = {
        allocationAmount: convertHexToDecimal(allocationAmount),
        claimedAmount: convertHexToDecimal(claimedAmount),
        claimableAmount: convertHexToDecimal(claimableAmount),
        availableAmount: availableAmount
      };

      if (!toNumber(newData.allocationAmount)) {
        setListRoundVisible((prevState: any) =>
          prevState.filter((item: any) => item !== keyItem)
        );
      } else {
        setListRoundVisible((prevState: any) => uniq([...prevState, keyItem]));
      }

      setRoundData((prevState: any) => ({
        ...prevState,
        ...newData
      }));

      updateAllData({ ...newData, index });
    } catch (err) {
      console.log('err=', err);
    }
  };

  useEffect(() => {
    if (account) {
      getAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, abi, address, index, library]);

  useEffect(() => {
    if (account && isCountdown) {
      const contract = getContract(address, abi, library, account as string);
      const getCountdownData = async () => {
        try {
          let time;
          const currentTime = Math.floor(new Date().getTime() / 1000);
          if (communityRound) {
            time = await contract._timestamps(0);
            setTimeCountdown(time.toNumber() * 1000);
          } else {
            time = await contract._startReleaseTimestamp();
            setTimeCountdown(time.toNumber() * 1000);
          }
          if (currentTime >= time) {
            setBtnClaim(true);
          } else {
            setBtnClaim(false);
          }
        } catch (err) {
          console.log(err);
        }
      };
      getCountdownData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isCountdown, address, abi, library]);

  return (
    <div className='round'>
      <div className='wrapper'>
        <div className='container'>
          <Row align='middle' justify='space-between'>
            <h4
              className='round__title'
              dangerouslySetInnerHTML={{
                __html: title
              }}
            />
            <Col className='desktop'>
              <Space size={24}>
                {!!timeCountdown && !isBtnClaim && (
                  <Countdown
                    date={timeCountdown}
                    renderer={rendererCountdown}
                    onComplete={handleComplete}
                  />
                )}
                {isBtnClaim && (
                  <div className='round__bottom'>
                    <Button
                      loading={isShowBtnClaim}
                      type='primary'
                      onClick={claimRound}
                      className='button-claim'
                      disabled={
                        !toNumber(roundData.claimableAmount) || !account
                      }
                    >
                      Claim
                    </Button>
                  </div>
                )}
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className='row-wrapper'>
        <div className='container'>
          <Row gutter={[{ xs: 45, md: 48 }, 20]}>
            <Col xs={24} md={6}>
              <StatisticComponent
                isConnected={!!account}
                title='Allocation Amount'
                percent={roundData.allocationAmount}
              />
            </Col>
            <Col xs={24} md={6}>
              <StatisticComponent
                isConnected={!!account}
                title='Claimed Amount'
                percent={roundData.claimedAmount}
              />
            </Col>
            <Col xs={24} md={6}>
              <StatisticComponent
                percent={roundData.availableAmount}
                isConnected={!!account}
                title='Available Amount'
              />
            </Col>
            <Col xs={24} md={6}>
              <StatisticComponent
                isConnected={!!account}
                title='Claimable Amount'
                percent={roundData.claimableAmount}
              />
            </Col>
          </Row>
          <Row align='middle' justify='space-between'>
            <Col className='mobile'>
              <Space size={24}>
                {!!timeCountdown && !isBtnClaim && (
                  <Countdown
                    date={timeCountdown}
                    renderer={rendererCountdown}
                    onComplete={handleComplete}
                  />
                )}
                {isBtnClaim && (
                  <div className='round__bottom'>
                    <Button
                      loading={isShowBtnClaim}
                      type='primary'
                      onClick={claimRound}
                      className='button-claim'
                      disabled={
                        !toNumber(roundData.claimableAmount) || !account
                      }
                    >
                      Claim
                    </Button>
                  </div>
                )}
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export { SummaryRoundComponent, RoundComponent };