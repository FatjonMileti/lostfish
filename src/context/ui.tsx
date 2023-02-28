import { AlertColor } from "@mui/material";
import React, { Dispatch, useContext, useEffect, useReducer } from "react";

export enum UIActionType {
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  SHOW_LOADING,
  HIDE_LOADING,
}
export interface IUIAction {
  type: UIActionType;
  payload?: any;
}
export interface IUIState {
  message: string | null;
  severity: AlertColor;
  isSnackbarOpen: boolean;
  isLoading: boolean;
}

const initialState: IUIState = {
  message: "",
  severity: "info",
  isSnackbarOpen: false,
  isLoading: false,
};

const reducer = (state: IUIState, action: IUIAction): IUIState => {
  const payload = action.payload;
  console.info(action);

  switch (action.type) {
    case UIActionType.SHOW_MESSAGE: {
      return {
        ...state,
        message: payload.message,
        severity: payload.severity || "info",
        isSnackbarOpen: true,
      };
    }
    case UIActionType.HIDE_MESSAGE: {
      return {
        ...state,
        isSnackbarOpen: false,
      };
    }
    case UIActionType.SHOW_LOADING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case UIActionType.HIDE_LOADING: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default: {
      return state;
    }
  }
};

export interface IUIContext {
  state: IUIState;
  dispatch: React.Dispatch<IUIAction>;
}
const Context = React.createContext<IUIContext | undefined>(undefined);

export const UIProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};
export const useUI = () => useContext(Context);
