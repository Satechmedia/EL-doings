// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { message } from 'antd';
import classNames from 'classnames';
import { CheckOutlined } from '@ant-design/icons';
import React from 'react';
import i18n from '../../i18n/i18n';

export default function showMessage(msgType?: any, msgContent = 'Something went wrong!', objValue?: any) {
  message.config({
    maxCount: 1,
  });

  let fieldMsg;
  if (objValue) {
    const key = (Object.keys(objValue) || [])[0];
    const val = objValue[key];
    fieldMsg = {
      [key]: i18n?.t(`common.${val}`),
    };
  }

  message[msgType]({
    content: i18n?.t(msgContent, fieldMsg) || msgContent,
    className: classNames({
      'message-success': msgType === 'success',
      'message-error': msgType === 'error',
    }),
    duration: 3,
    maxCount: 1,
    icon: msgType === 'success' && <CheckOutlined />,
  });
}
