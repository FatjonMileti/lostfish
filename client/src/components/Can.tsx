import React, { useContext } from 'react';
import { CASLAction, AppSubjects } from '../utils/ability.util';
import { AbilityContext } from '../context/AbilityContext';
import { useAppAbility } from '../hooks/useAppAbility';
interface CanProps {
  do: CASLAction;
  on: AppSubjects;
  children: React.ReactNode;
}

const Can: React.FC<CanProps> = ({ do: action, on: subject, children }) => {
  const contextValue = useContext(AbilityContext);

  const ability = useAppAbility();

  if (!contextValue) {
    return null;
  }
  const { rules } = contextValue;
  console.log({ rules });
  const canPerformAction = rules.some((rule) => {
    return rule.action === action && rule.subject === subject;
  });

  return canPerformAction ? <>{children}</> : null;
};

export default Can;

// import { createContextualCan } from '@casl/react';
// import { AbilityContext } from '../context/AbilityContext';
//
// export default createContextualCan(AbilityContext.Consumer);
