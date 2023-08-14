// Define an interface for the text tabs
export interface TextTab {
  tabLabel: string;
  value: string;
}

// Define an interface for the template role
export interface TemplateRole {
  email: string;
  name: string;
  tabs: { textTabs: TextTab[] };
  clientUserId: string;
  roleName: string;
}
