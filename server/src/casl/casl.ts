import { AbilityBuilder, createMongoAbility, PureAbility } from '@casl/ability';
import { Role } from '../api/User/user.interface';
import { CASLAction, AppSubjects } from './casl.interface';

function defineAbilitiesFor(role: string): PureAbility<[CASLAction, AppSubjects]> {
  const { can, cannot, build } = new AbilityBuilder<PureAbility<[CASLAction, AppSubjects]>>(
    createMongoAbility
  );

  if (role === Role.Client) {
    can(CASLAction.Manage, 'all');
    cannot(CASLAction.Create, 'SignGenerator');
    cannot(CASLAction.Update, 'SignGenerator');
    cannot(CASLAction.Delete, 'SignGenerator');
    can(CASLAction.Read, 'SignGenerator');
    cannot(CASLAction.Read, 'StarredTenants');
    can(CASLAction.Read, 'StarredProperties');
  } else if (role === Role.Agent) {
    can(CASLAction.Manage, 'all');
  } else if (role === Role.Landlord) {
    can(CASLAction.Manage, 'all');
    can(CASLAction.Manage, 'SignGenerator');
    cannot(CASLAction.Read, 'StarredProperties');
    can(CASLAction.Read, 'StarredTenants');
  } else if (role === Role.Client) {
    can(CASLAction.Manage, 'all');
  } else if (role === Role.NeWUser) {
    can(CASLAction.Manage, 'all');
  }

  return build();
}

export default defineAbilitiesFor;
