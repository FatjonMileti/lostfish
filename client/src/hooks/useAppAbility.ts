import { useContext } from 'react';
import { AbilityContext } from '../context/AbilityContext';

export const useAppAbility = () => useContext(AbilityContext);
