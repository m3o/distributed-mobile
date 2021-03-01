export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  current_user?: boolean;
  chat: {
    last_seen?: number | string;
    messages?: any[],
  }
}

export interface State {
  user?: User;
}

interface Action {
  type: string;
  payload?: User;
}

export function Login(user: User): Action {
  return { type: 'user.login', payload: user }
}

export function Logout(): Action {
  return { type: 'user.logout' }
}

export default function userReducer(state: State = {}, action: Action) {
  switch (action.type) {
    case 'user.login':
      return { ...state, user: action.payload }
    case 'user.logout':
      return { ...state, user: undefined }
    default:
      return state
  }
};
