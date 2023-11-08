import React, { ReactNode, useState, useCallback, useContext, useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../globalState/globalState';
import axios from '../utils/axios';
import NotFoundPage from '../pages/404';
import { ApiUserDocumentType } from '../pages/MyAccount/user.interface';
import { buildAbilityFor } from '../utils/ability.util';
import { AbilityContext } from './AbilityContext';
import { AppAbilityType, AppAbility } from '../utils/ability.util';
import { unpackRules } from '@casl/ability/extra';

import { useUserStore } from '../globalState/user';
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined ? { type: Key } : { type: Key; payload: M[Key] };
};

const INITIALIZE = 'INITIALIZE';
const SET_ACCOUNT = 'SET_ACCOUNT';

type PropertyActionTypes = {
  [INITIALIZE]: {
    isInitialized: boolean;
    user: any;
    ability: AppAbilityType;
  };
  [SET_ACCOUNT]: {
    user: ApiUserDocumentType;
    ability: AppAbilityType;
  };
};

export type PropertyState = {
  isInitialized: boolean;
  user: ApiUserDocumentType | null;
  ability: AppAbilityType;
};

const initialState: PropertyState = {
  isInitialized: false,
  user: null,
  ability: new AppAbility()
};

const JWTReducer = (
  state: PropertyState,
  action: ActionMap<PropertyActionTypes>[keyof ActionMap<PropertyActionTypes>]
) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isInitialized: true,
        user: action.payload.user,
        ability: action.payload.ability
      };
    case SET_ACCOUNT:
      return {
        ...state,
        isInitialized: true,
        user: action.payload.user,
        ability: action.payload.ability
      };

    default:
      return state;
  }
};

export interface UserContextType {
  isInitialized: boolean;
  user: ApiUserDocumentType | null;
  getOne: () => void;
}

export const UserContext = React.createContext<UserContextType>({
  isInitialized: false,
  user: null,
  getOne: () => {}
});

export function useUser() {
  return useContext(UserContext);
}
export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const [error, setError] = useState<any>(null);

  const user = useUserStore();
  const setUser = useUserStore((state) => state.set);

  useEffect(() => {
    if (user.auth) getOne();
  }, [user.auth]);

  const getOne = useCallback(async () => {
    try {
      const { data } = await axios(user.auth.access_token).get('/api/account/me');

      const ability = buildAbilityFor(data.role, unpackRules(data.rules));

      setUser((user: any) => ({ ...user, ability: user.ability }));
      dispatch({
        type: SET_ACCOUNT,
        payload: {
          user: data,
          ability
        }
      });
    } catch (error: any) {
      setError(error);
    }
  }, [user.auth]);

  return (
    <AbilityContext.Provider value={state.ability}>
      <UserContext.Provider value={{ ...state, getOne }}>
        {error ? <NotFoundPage /> : children}
      </UserContext.Provider>
    </AbilityContext.Provider>
  );
}
