import { Channel } from "./Channel";

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    SignUp: undefined;
    AdminDashboard: undefined;
    ManagerDashboard: undefined;
    EmployeeDashboard: undefined;
    LeaveScreen: undefined;
    SchedulesScreen: undefined;
    ClockInOutScreen: undefined;
    EmployeeManagementScreen: undefined;
    SettingsScreen:undefined;
    GrossPaymentScreen: undefined;
    LeaveRequestScreen: undefined;
    EditUserDetailScreens: undefined;
    ChatScreen: {channelName: string;
      channelId:string;
      refreshChannels: () => Promise<void>;
      allChannels: Channel[];
    };
  };
  