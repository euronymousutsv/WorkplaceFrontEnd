import React from "react";
import { SafeAreaView, Text } from "react-native";
import { Leave } from "../../../api/leave/leaveRequest";

const LeaveDetail = () => {
  const [leavedata, setLeaveData] = React.useState<Leave | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {}, []);
  return (
    <>
      {loading ? (
        <SafeAreaView>
          <Text>Loading...</Text>
        </SafeAreaView>
      ) : (
        <SafeAreaView>
          <Text>{leavedata?.leaveType}</Text>
          <Text>{leavedata?.startDate}</Text>
          <Text>{leavedata?.endDate}</Text>
          <Text>{leavedata?.isApproved}</Text>
        </SafeAreaView>
      )}
    </>
  );
};

export default LeaveDetail;
