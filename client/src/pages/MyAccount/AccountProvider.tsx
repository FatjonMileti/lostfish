import React, { ReactNode, useState, useCallback, useContext, useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../globalState';
import axios from '../../utils/axios';
import NotFoundPage from '../404';
import { UserDocument } from './user.interface';

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined ? { type: Key } : { type: Key; payload: M[Key] };
};

const INITIALIZE = 'INITIALIZE';
const SET_ACCOUNT = 'SET_ACCOUNT';

type PropertyActionTypes = {
  [INITIALIZE]: {
    isInitialized: boolean;
    user: any;
  };
  [SET_ACCOUNT]: {
    user: UserDocument;
  };
};

export type PropertyState = {
  isInitialized: boolean;
  user: UserDocument | null;
};

const initialState: PropertyState = {
  isInitialized: false,
  user: null
};

const JWTReducer = (
  state: PropertyState,
  action: ActionMap<PropertyActionTypes>[keyof ActionMap<PropertyActionTypes>]
) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isInitialized: true,
        user: action.payload.user
      };
    case SET_ACCOUNT:
      return {
        ...state,
        isInitialized: true,
        user: action.payload.user
      };

    default:
      return state;
  }
};

export interface UserContextType {
  isInitialized: boolean;
  user: UserDocument | null;
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
  const params = useParams<{ id: string }>();

  const {
    user: [{ auth }]
  } = useGlobalState();

  useEffect(() => {
    getOne();
  }, [params.id]);

  const getOne = useCallback(async () => {
    try {
      const response = await axios(auth.access_token).get('/api/account/me');
      dispatch({
        type: SET_ACCOUNT,
        payload: {
          user: response.data
        }
      });
    } catch (error: any) {
      setError(error);
    }
  }, [params.id]);

  return (
    <UserContext.Provider value={{ ...state, getOne }}>
      {error ? <NotFoundPage /> : children}
    </UserContext.Provider>
  );
}
