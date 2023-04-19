import React, { Dispatch, useContext, useEffect, useReducer } from "react";
import { Role } from "../enums";

export enum UserActionType {
  LOGIN,
  LOGOUT,
}
export interface IUserAction {
  type: UserActionType;
  payload?: any;
}
export interface IUserState {
  username: string | null;
  user_id: string | null;
  role: Role | null;
  token: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
}

const initialState: IUserState = {
  username: null,
  role: null,
  user_id: null,
  token: localStorage.getItem("__a_token") || null,
  refreshToken: localStorage.getItem("__r_token") || null,
  rememberMe: localStorage.getItem("__rmb")
    ? localStorage.getItem("__rmb") === "true"
    : false,
};
if (initialState.token) {
  const token = JSON.parse(window.atob(initialState.token.split(".")[1]));
  initialState.username = token.username;
  initialState.role = token.role;
  initialState.user_id =  token.user_id
}

const reducer = (state: IUserState, action: IUserAction): IUserState => {
  const payload = action.payload;

  console.info(action);
  switch (action.type) {
    case UserActionType.LOGIN: {
      localStorage.setItem("__a_token", payload.token);
      localStorage.setItem("__r_token", payload.refreshToken);
      localStorage.setItem("__rmb", payload.rememberMe);

      const token = JSON.parse(window.atob(payload.token.split(".")[1]));

      const username = token.username;
      const role: Role = token.role;

      return {
        ...state,
        username,
        role,
        user_id: token.user_id,
        token: payload.token,
        refreshToken: payload.refreshToken,
        rememberMe: payload.rememberMe,
      };
    }
    case UserActionType.LOGOUT: {
      localStorage.removeItem("__a_token");
      localStorage.removeItem("__r_token");

      return {
        ...state,
        username: null,
        token: null,
        refreshToken: null,
      };
    }
    default: {
      return state;
    }
  }
};

export interface IUserContext {
  state: IUserState;
  dispatch: React.Dispatch<IUserAction>;
}
const Context = React.createContext<IUserContext | undefined>(undefined);

export const UserProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};
export const useUser = () => useContext(Context);
