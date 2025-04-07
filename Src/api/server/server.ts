export type ChannelResponse = {
  id: string;
  name: string;
  highestRoleToAccessChannel: string;
};

export interface createChannelResponse {
  serverId: string;
  channelName: string;
}

export interface userJoinedServerResponse {
  serverId: string;
}

export interface SearchServerResponse {
  id: string;
  name: string;
  idVerificationRequired: string;
  ownerId: string;
}

export interface joinAServerResponse {
  id: string;
  name: string;
  idVerificationRequired: boolean;
  inviteLink: string;
}

export const enum Role {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  MANAGER = "manager",
}

export interface getAllChannelForCurrentServerResponse
  extends ChannelResponse {}
export interface createChannelResponse extends ChannelResponse {}
