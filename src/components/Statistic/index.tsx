import React, { FC } from 'react';
import { Progress, Skeleton } from 'antd';
import BigNumber from 'bignumber.js';

import PlaceholderIcon from 'resources/images/placeholder-icon.png';
import { DECIMAL_SCALE } from '../../common/constant';
import { toNumber } from '../../utils/helpers';

BigNumber.config({
  EXPONENTIAL_AT: 100
});

const formatNumber = (value?: string | null) => {
  if (!toNumber(value)) {
    return '0.00';
  } else if (toNumber(value) < Math.pow(10, -2)) {
    return `< ${Math.pow(10, -2)}`;
  }

  return new BigNumber(value || 0)
    .toFixed(DECIMAL_SCALE)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const StatisticComponent: FC<{
  isConnected: boolean;
  index?: any;
  title: string;
  className?: string;
  percent?: null | string;
}> = ({ isConnected = false, index, title, percent, className = '' }) => {
  const isNull = (value: any) => {
    return value === null;
  };

  return (
    <div className={`statistic ${className}`}>
      <div className='statistic__left'>{index}</div>
      <div className='statistic__right'>
        <div className='statistic__title'>{title}</div>
        {!isConnected && (
          <Progress
            percent={30}
            steps={17}
            showInfo={false}
            strokeColor='#08f2f1'
            trailColor='#192b6d'
          />
        )}
        {isConnected && (
          <div className='statistic__value'>
            {!isNull(percent) ? (
              formatNumber(percent)
            ) : (
              <Skeleton.Input style={{ width: 60 }} active size='small' />
            )}
            <div className='highlight'>BYN</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticComponent;