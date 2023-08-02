import {
  AbilityBuilder,
  createMongoAbility,
  PureAbility,
  MatchConditions,
  ConditionsMatcher,
  FieldMatcher
} from '@casl/ability';
import { Role } from '../api/User/user.interface';
import { CASLAction, AppSubjects } from './casl.interface';
const lambdaMatcher: ConditionsMatcher<any> = (matchConditions: MatchConditions) => {
  return matchConditions;
};

export const fieldMatcher: FieldMatcher = (fields) => (field) => {
  return fields.includes(field);
};

function defineAbilitiesFor(role: string, userId?: string): PureAbility<[CASLAction, AppSubjects]> {
  const { can, cannot, build } = new AbilityBuilder<PureAbility<[CASLAction, AppSubjects]>>(
    createMongoAbility
  );

  if (role === Role.Agent) {
    can(CASLAction.Manage, 'all');
  } else if (role === Role.Client) {
    can(CASLAction.Manage, 'User', { _id: userId });
    can(CASLAction.Manage, 'Chat');
    can(CASLAction.Manage, 'Client');
    can(CASLAction.Read, 'SignGenerator');
    can(CASLAction.Manage, 'StarredProperties');
    can(CASLAction.Read, 'SignURL');
    can(CASLAction.Manage, 'Criteria');
  } else if (role === Role.Landlord) {
    can(CASLAction.Manage, 'User', { user: userId });
    can(CASLAction.Manage, 'Asset');
    can(CASLAction.Manage, 'SignGenerator');
    can(CASLAction.Manage, 'StarredTenants');
    can(CASLAction.Read, 'SignURL');
  } else if (role === Role.NeWUser) {
    can(CASLAction.Manage, 'User', { user: userId });
    can(CASLAction.Manage, 'Criteria');
  }

  return build({ conditionsMatcher: lambdaMatcher, fieldMatcher });
}

export default defineAbilitiesFor;
