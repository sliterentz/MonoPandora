import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import authThunkReducer from './slices/authThunk';
import userThunkReducer from './slices/userThunk';
import roleThunkReducer from './slices/roleThunk';
import permissionThunkReducer from './slices/permissionThunk';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const authPersistConfig = {
  key: 'auth',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const rolePersistConfig = {
  key: 'role',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const permissionPersistConfig = {
  key: 'permission',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  auth: persistReducer(authPersistConfig, authThunkReducer),
  user: persistReducer(userPersistConfig, userThunkReducer),
  role: persistReducer(rolePersistConfig, roleThunkReducer),
  permission: persistReducer(permissionPersistConfig, permissionThunkReducer),
});

export default rootReducer;
