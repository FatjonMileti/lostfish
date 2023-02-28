import { AlertColor } from "@mui/material";
import { IUIContext, UIActionType, useUI } from "../context/ui";

export const showMessage =
  (UIContext: IUIContext) => (message: string, severity?: AlertColor) => {
    UIContext.dispatch({
      type: UIActionType.SHOW_MESSAGE,
      payload: {
        message,
        severity,
      },
    });
  };
export const hideMessage = (UIContext: IUIContext) => () => {
  UIContext.dispatch({
    type: UIActionType.HIDE_MESSAGE,
    payload: null,
  });
};

export const startLoading = (UIContext: IUIContext) => () => {
  UIContext.dispatch({
    type: UIActionType.SHOW_LOADING,
  });
};
export const stopLoading = (UIContext: IUIContext) => () => {
  UIContext.dispatch({
    type: UIActionType.HIDE_LOADING,
  });
};
