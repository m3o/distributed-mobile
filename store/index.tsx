import { combineReducers, createStore } from 'redux';
import userReducer, { State as UserState } from './user';
import groupsReducer, { State as GroupsState } from './groups';
import { devToolsEnhancer } from 'redux-devtools-extension';

export interface GlobalState {
  user: UserState,
  groups: GroupsState,
}

export default createStore(
  combineReducers({
    user: userReducer,
    groups: groupsReducer,
  }),
  devToolsEnhancer({
    name: "Distributed Mobile",
  }),
);
