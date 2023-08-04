import {
  AbilityBuilder,
  PureAbility,
  AbilityClass,
  SubjectRawRule,
  MatchConditions,
  ConditionsMatcher,
  FieldMatcher
} from '@casl/ability';

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
  | 'StarredTenants'
  | 'Properties'
  | 'Matches'
  | 'Message';

export enum Role {
  Agent = 'Agent',
  Client = 'Tenant',
  Landlord = 'Landlord',
  NewUser = 'NewUser'
}

export type AppAbilityType = PureAbility<[CASLAction, AppSubjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbilityType>;

const cnMatcher: ConditionsMatcher<any> = (matchConditions: MatchConditions) => matchConditions;

export const fieldMatcher: FieldMatcher = (fields) => (field) => {
  return fields.includes(field);
};

export default function defineRulesFor(role: string) {
  const { can, rules, cannot } = new AbilityBuilder(AppAbility);

  if (role === Role.Landlord) {
    can(CASLAction.Read, 'Menu', ['Home', 'Property', 'Match', 'Message']);
  } else if (role === Role.Client) {
    can(CASLAction.Read, 'Menu', ['Home', 'Match', 'Message']);
  } else if (role === Role.NewUser) {
    can(CASLAction.Read, 'Menu', ['Home']);
  }

  return rules;
}

export function buildAbilityFor(
  role: string,
  caslRules: SubjectRawRule<any, any, any>[] = []
): AppAbilityType {
  return new AppAbility([...caslRules, ...defineRulesFor(role)], {
    // @ts-ignore
    detectSubjectType: (object) => object!.type,
    conditionsMatcher: cnMatcher,
    fieldMatcher
  });
}
