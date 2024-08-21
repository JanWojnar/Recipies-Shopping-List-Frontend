import {User} from "../user.model";
import {AthActions} from "./auth.actions";
import * as AuthActions from "../store/auth.actions"

export interface AuthState {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false
}

export function authReducer(state = initialState, action: AthActions): AuthState {
  switch (action.type) {

    case AuthActions.SIGNUP:
      return {
        ...state,
        loading: true
      }
    case AuthActions.LOGIN:
      return {
        ...state,
        authError: null,
        loading: true
      }
    case AuthActions.AUTOLOGIN:
      return {
        ...state
      }
    case AuthActions.AUTHENTICATE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        authError: null,
        loading: false
      }
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      }
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        authError: null
      }
    case AuthActions.ACKNOWLEDGE:
      return {
        ...state,
        authError: null
      }
    default:
      return {
        ...state
      };
  }
}
