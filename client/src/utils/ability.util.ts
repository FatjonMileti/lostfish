import { AbilityBuilder, PureAbility, AbilityClass, SubjectRawRule } from '@casl/ability';

export enum CASLAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export type AppSubjects =
  | 'User'
  | 'Asset'
  | 'Chat'
  | 'all'
  | 'Menu'
  | 'Client'
  | 'Agent'
  | 'SignGenerator'
  | 'SignURL'
  | 'StarredProperties'
  | 'StarredTenants';

export enum Role {
  Agent = 'Agent',
  Client = 'Tenant',
  Landlord = 'Landlord',
  NewUser = 'NewUser'
}

export type AppAbilityType = PureAbility<[CASLAction, AppSubjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbilityType>;

export default function defineRulesFor(role: string) {
  const { can, rules, cannot } = new AbilityBuilder(AppAbility);

  if (role === Role.Landlord) {
    can(CASLAction.Manage, 'Menu');
    can(CASLAction.Manage, 'Agent');
    // can(CASLAction.Read, 'StarredTenants');
  } else if (role === Role.Client) {
    can(CASLAction.Manage, 'Client');
    // can(CASLAction.Read, 'StarredProperties');
  } else if (role === Role.Agent) {
    can(CASLAction.Manage, 'Agent');
  } else if (role === Role.NewUser) {
    can(CASLAction.Manage, 'all');
  }

  return rules;
}

export function buildAbilityFor(
  role: string,
  caslRules: SubjectRawRule<any, any, any>[] = []
): AppAbilityType {
  return new AppAbility([...caslRules, ...defineRulesFor(role)], {
    // @ts-ignore
    detectSubjectType: (object) => object!.type
  });
}
