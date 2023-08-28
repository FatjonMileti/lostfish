export enum CASLAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export type AppSubjects =
  | 'User'
  | 'Property'
  | 'Chat'
  | 'all'
  | 'Agent'
  | 'Client'
  | 'SignGenerator'
  | 'SignURL'
  | 'StarredProperties'
  | 'StarredTenants'
  | 'Criteria'
  | 'Matches'
  | 'Documents';
