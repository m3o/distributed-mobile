import { User } from './user';

export interface Message {
  id: string;
  text: string;
  sent_at?: string | number;
  author?: User;
}

export interface Group {
  id: string;
  name: string;
  members?: User[];
  threads?: Thread[];
  websocket?: Websocket;
}

export interface Websocket {
  topic: string;
  token: string;
  url: string;
}

export interface Thread {
  id: string;
  topic: string;
  messages?: Message[];
  last_seen?: string;
}

export interface State {
  groups?: Group[];
}

interface Action {
  type: string;
  payload?: Group | Group[];
}

export function SetGroups(groups: Group[]): Action {
  return { type: 'groups.set.batch', payload: groups }
}

export function SetGroup(group: Group): Action {
  return { type: 'groups.set', payload: group }
}

export default function userReducer(state: State = {}, action: Action) {
  switch (action.type) {
    case 'groups.set.batch':
      return { ...state, groups: (action.payload as Group[]).sort((a,b) => a.id > b.id ? 1 : - 1) }
    case 'groups.set':
      return { 
        ...state, 
        groups: [
          ...state.groups!.filter(g => g.id !== (action.payload as Group).id),
          action.payload as Group,
        ].sort((a,b) => a.id > b.id ? 1 : - 1)
      }
    case 'user.logout':
      return { ...state, groups: undefined }
    default:
      return state
  }
};
