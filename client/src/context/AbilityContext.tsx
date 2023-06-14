import { createContext } from 'react';
import { AppAbilityType } from '../utils/ability.util';

export const AbilityContext = createContext<AppAbilityType>(null as unknown as AppAbilityType);
