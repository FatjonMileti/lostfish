import React from 'react';
interface BasicStorage {
  getItem: Function;
  setItem: Function;
}
interface Storage {
  name: string;
  defaultState: any;
  config?: {
    persist?: boolean;
    storage?: BasicStorage;
  };
  useState: Function;
}
const defaultValue: { [key: string]: any } = {};

const GlobalStateContext = React.createContext(defaultValue);
export const useGlobalState = () => React.useContext(GlobalStateContext);

let storages: { [key: string]: Storage } = {};

export function registerStore<S>(name: string, defaultState: S, config: Storage['config'] | void) {
  storages[name] = {
    name: name,
    defaultState,
    useState:
      (config?.persist && ((defaultState: S) => usePersistedState(defaultState, name, config.storage))) ||
      React.useState
  };
}

export const usePersistedState = (
  defaultValue: any,
  key: string,
  storage: BasicStorage | undefined = localStorage
) => {
  const [state, setState] = React.useState(JSON.parse(storage.getItem(key)) || defaultValue);
  React.useEffect(() => {
    storage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  let allStores: { [key: string]: [any, Function] } = {};
  for (const [key, { useState, defaultState }] of Object.entries(storages)) {
    allStores[key] = useState(defaultState);
  }
  return <GlobalStateContext.Provider value={allStores}>{children}</GlobalStateContext.Provider>;
};
