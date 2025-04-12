export interface Channel {
    id: string;
    name: string;
    newMessages: number;
    isPrivate: boolean;
    highestRoleToAccessChannel?: 'admin' | 'manager' | 'employee';
  }
  