import React, { ReactNode, useState, useCallback, useContext, useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../../globalState/globalState';
import axios from '../../../utils/axios';
import NotFoundPage from '../../404';
import { useUserStore } from '../../Login/Login';

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined ? { type: Key } : { type: Key; payload: M[Key] };
};

const INITIALIZE = 'INITIALIZE';
const SET_PROPERTY = 'SET_PROPERTY';

type PropertyActionTypes = {
  [INITIALIZE]: {
    isInitialized: boolean;
    property: any;
  };
  [SET_PROPERTY]: {
    property: any;
  };
};

export type PropertyState = {
  isInitialized: boolean;
  property: any;
};

const initialState: PropertyState = {
  isInitialized: false,
  property: {}
};

const JWTReducer = (
  state: PropertyState,
  action: ActionMap<PropertyActionTypes>[keyof ActionMap<PropertyActionTypes>]
) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isInitialized: true,
        property: action.payload.property
      };
    case SET_PROPERTY:
      return {
        ...state,
        isInitialized: true,
        property: action.payload.property
      };

    default:
      return state;
  }
};

export interface PropertyContextType {
  isInitialized: boolean;
  property: any | null;
  getOne: () => void;
}

export const PropertyContext = React.createContext<PropertyContextType>({
  isInitialized: false,
  property: null,
  getOne: () => {}
});

export function useProperty() {
  return useContext(PropertyContext);
}
export function PropertyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const [error, setError] = useState<any>(null);
  const params = useParams<{ id: string }>();

  const { auth } = useUserStore();

  useEffect(() => {
    getOne();
  }, [params.id]);

  const getOne = useCallback(async () => {
    try {
      const response = await axios(auth.access_token).get('/api/asset/' + params.id);
      dispatch({
        type: SET_PROPERTY,
        payload: {
          property: response.data
        }
      });
    } catch (error: any) {
      setError(error);
    }
  }, [params.id]);

  return (
    <PropertyContext.Provider value={{ ...state, getOne }}>
      {error ? <NotFoundPage /> : children}
    </PropertyContext.Provider>
  );
}
