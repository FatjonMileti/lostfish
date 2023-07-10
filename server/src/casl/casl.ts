import { AbilityBuilder, createMongoAbility, PureAbility } from '@casl/ability';
import { Role } from '../api/User/user.interface';
import { CASLAction, AppSubjects } from './casl.interface';

function defineAbilitiesFor(role: string): PureAbility<[CASLAction, AppSubjects]> {
  const { can, cannot, build } = new AbilityBuilder<PureAbility<[CASLAction, AppSubjects]>>(
    createMongoAbility
  );

  if (role === Role.Admin) {
    can(CASLAction.Manage, 'all');
  } else if (role === Role.Client) {
    can(CASLAction.Manage, 'Client');
    can(CASLAction.Read, 'Asset');
  } else if (role === Role.Agent) {
    can(CASLAction.Read, 'Asset');
    can(CASLAction.Manage, 'all');
  }

  return build();
}

export default defineAbilitiesFor;
