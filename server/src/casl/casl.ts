import {
  AbilityBuilder,
  createMongoAbility,
  PureAbility,
  MatchConditions,
  ConditionsMatcher,
  FieldMatcher
} from '@casl/ability';
import { Role, UserDocument } from '../api/User/user.interface';
import { CASLAction, AppSubjects } from './casl.interface';

export interface IUserAbilityData {
  _id: string;
  role: string;
}

const lambdaMatcher: ConditionsMatcher<any> = (matchConditions: MatchConditions) => {
  return matchConditions;
};

export const fieldMatcher: FieldMatcher = (fields) => (field) => {
  return fields.includes(field);
};

function defineAbilitiesFor(user: UserDocument | IUserAbilityData): PureAbility<[CASLAction, AppSubjects]> {
  const { can, cannot, build } = new AbilityBuilder<PureAbility<[CASLAction, AppSubjects]>>(
    createMongoAbility
  );

  if (user.role === Role.Agent) {
    can(CASLAction.Manage, 'all');
  } else if (user.role === Role.Client) {
    can(CASLAction.Manage, 'User', user._id.toString());
    can(CASLAction.Manage, 'Chat');
    can(CASLAction.Manage, 'Client');
    can(CASLAction.Read, 'SignGenerator');
    can(CASLAction.Manage, 'StarredProperties');
    can(CASLAction.Read, 'SignURL');
    can(CASLAction.Manage, 'Criteria');
    can(CASLAction.Read, 'Matches');
  } else if (user.role === Role.Landlord) {
    can(CASLAction.Manage, 'User', user._id.toString());
    can(CASLAction.Manage, 'Asset');
    can(CASLAction.Manage, 'SignGenerator');
    can(CASLAction.Manage, 'StarredTenants');
    can(CASLAction.Read, 'SignURL');
    can(CASLAction.Read, 'Matches');
  } else if (user.role === Role.NeWUser) {
    can(CASLAction.Manage, 'User', user._id.toString());
    can(CASLAction.Manage, 'Criteria');
    cannot(CASLAction.Read, 'Matches');
  }

  return build({ conditionsMatcher: lambdaMatcher, fieldMatcher });
}

export default defineAbilitiesFor;
