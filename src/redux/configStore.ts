import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import createSagaMiddleware from 'redux-saga';

/**
 *  blacklist config redux
 *  whitelist config redux persit
 */

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: [''],
  blacklist: [''],
};

const root = persistReducer(persistConfig, rootReducer);
export const sagaMiddleware = createSagaMiddleware();

export const store = createStore(root, applyMiddleware(sagaMiddleware));
export const persistor = persistStore(store);
