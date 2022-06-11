import React, { memo, useRef } from 'react';
import { Layout, Space } from 'antd';
import { Route, Switch} from 'react-router';

import HeaderCommon from '../../components/Header';
import HomePage from '../home';
import { socialLinks } from './socials';
import Footer from '../../components/Footer';
import { useWeb3React } from '@web3-react/core';

const { Content } = Layout;

function LayoutCommon() {
  const connectButtonRef = useRef(null) as any;

  const { account } = useWeb3React();

  return (
    <Layout className='layout'>
      <Layout>
        <HeaderCommon connectButtonRef={connectButtonRef} />
        <Content>
          {!account && (
            <div className='container social'>
              <Space size={24}>
                {socialLinks.map(({ name, icon, link }: any) => (
                  <a href={link} target='_blank' rel='noopener noreferrer'>
                    <img src={icon} alt={name} />
                  </a>
                ))}
              </Space>
            </div>
          )}
          <Switch>
            <Route
              path='/'
              exact
              render={(props) => (
                <HomePage {...props} connectButtonRef={connectButtonRef} />
              )}
            />
          </Switch>
        </Content>
        {!account && <Footer />}
      </Layout>
    </Layout>
  );
}
export default memo(LayoutCommon);
