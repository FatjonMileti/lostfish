import React from "react";
import { UserActionType, IUserContext } from "../context/user";
import config from "../config";

export const login =
  (userContext: IUserContext) =>
  async (username: string, password: string, rememberMe: boolean) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/account/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok || response.status !== 200) return false;

      const json = await response.json();

      userContext.dispatch({
        type: UserActionType.LOGIN,
        payload: {
          token: json.access_token,
          refreshToken: json.refresh_token,
          rememberMe: rememberMe,
        },
      });
      return true;
    } catch (err) {
      return false;
    }
  };

export const logout = (userContext: IUserContext) => async () => {
  try {
    await fetch(`${config.apiUrl}/api/account/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.state.token}`,
      },
    });
  } catch (err) {
    console.error("could not logout", err);
  }

  userContext.dispatch({
    type: UserActionType.LOGOUT,
  });
};

export const refresh = (userContext: IUserContext) => async () => {
  try {
    const response = await fetch(`${config.apiUrl}/api/account/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh_token: userContext.state.refreshToken,
      }),
    });

    if (!response.ok || response.status !== 200) return false;

    const json = await response.json();

    userContext.dispatch({
      type: UserActionType.LOGIN,
      payload: {
        token: json.access_token,
        refreshToken: json.refresh_token,
        rememberMe: userContext.state.rememberMe,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
};
