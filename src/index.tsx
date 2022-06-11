// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core';
import './index.css';
import './i18n/i18n';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { persistor, store } from './redux/configStore';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';

import 'antd/dist/antd.css';
import './App.css';
import './sass/_app.scss';
import { getLibrary } from './utils/getLibrary';

const onBeforeLift = (store) => () => {};

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Provider store={store}>
      <PersistGate onBeforeLift={onBeforeLift(store)} loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </Web3ReactProvider>,
  document.getElementById('root')
);
// sagaMiddleware.run(rootSaga);
serviceWorker.unregister();