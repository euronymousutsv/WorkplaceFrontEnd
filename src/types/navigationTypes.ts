import { Channel } from "./Channel";
import { CompositeNavigationProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  AdminDashboard: undefined;
  ManagerDashboard: undefined;
  EmployeeDashboard: undefined;
  LeaveScreen: undefined;
  SchedulesScreen: {officeId:string};
  ClockInOutScreen: undefined;
  EmployeeManagementScreen: undefined;
  SettingsScreen: undefined;
  GrossPaymentScreen: undefined;
  LeaveRequestScreen: undefined;
  EditUserDetailScreens: undefined;
  ClockInOutScreenPhone: undefined;
  MessageThemeScreen: undefined
  ChatScreen: {
    channelName: string;
    channelId: string;
    refreshChannels: () => Promise<void>;
    allChannels: Channel[];
  };
  OfficeDetail: {
    officeId: string;
    officeName: string;
  }; 

};