import { AbilityBuilder, PureAbility, AbilityClass, SubjectRawRule, ConditionsMatcher } from '@casl/ability';

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
  | 'AdminMenu'
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

// Define the conditionsMatcher function
const conditionsMatcher: (subject: AppSubjects, field: string, value: string) => boolean = (
  subject: AppSubjects,
  field: string,
  value: string
) => {
  // Implement your logic to match the conditions here
  // Return true if the conditions are matched, false otherwise
  return true;
};

export type AppAbilityType = PureAbility<[CASLAction, AppSubjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbilityType>;

export default function defineRulesFor(role: string) {
  const { can, rules, cannot } = new AbilityBuilder(AppAbility);

  if (role === Role.Landlord) {
    can(CASLAction.Read, 'Menu');
    can(CASLAction.Manage, 'Agent');
    cannot(CASLAction.Read, 'AdminMenu');
  } else if (role === Role.Client) {
    can(CASLAction.Read, 'Menu');
    can(CASLAction.Manage, 'Client');
    cannot(CASLAction.Read, 'AdminMenu');
  } else if (role === Role.NewUser) {
    can(CASLAction.Read, 'Menu');
    can(CASLAction.Manage, 'all');
    cannot(CASLAction.Read, 'AdminMenu');
  } else if (role === Role.Agent) {
    can(CASLAction.Read, 'AdminMenu');
    cannot(CASLAction.Read, 'Menu');
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
