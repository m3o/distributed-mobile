import { combineReducers, createStore } from 'redux';
import userReducer, { State as UserState } from './user';

export interface GlobalState {
  user: UserState,
}

export default createStore(combineReducers({
  user: userReducer
}));