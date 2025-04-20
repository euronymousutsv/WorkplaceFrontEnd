import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { getLoggedInUserServer } from "../../../api/server/serverApi";
import { ApiError } from "../../../api/utils/apiResponse";
import { getToken, Plat, saveToken } from "../../../api/auth/token";
import { ChannelResponse } from "../../../api/server/server";
import { getAllChannelForCurrentOffice } from "../../../api/server/channelApi";
import Toast from "react-native-toast-message";
import ChatChannelList from "../../../web/adminDashboard/components/ChatChannelList";

const CustomDrawerContent = (props: any) => {
  const [serverName, setServerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<ChannelResponse[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      setLoading(false); // Web uses ChatChannelList separately
      return;
    }

    (async () => {
      try {
        await handleGetServerDetail();
        await handleGetAllChannels();
      } catch (error) {
        console.error("Error initializing drawer content:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleGetServerDetail = async () => {
    try {
      const platformType = Plat.PHONE;
      const res = await getLoggedInUserServer(platformType);

      if (res instanceof ApiError) {
        console.log("Server fetch error:", res.message);
      } else if ("statusCode" in res && "data" in res) {
        const serverId = res.data.joinedServer.serverId;
        const officeId = res.data?.searchedOffice?.officeId || "";
        const serverName = res.data.joinedServer.name;
        setServerName(serverName);

        await saveToken("serverId", serverId, platformType);
        await saveToken("officeId", officeId, platformType);
        await saveToken("serverName", serverName, platformType);
      } else {
        console.log("Unexpected response while fetching server.");
      }
    } catch (error) {
      console.error("Error in handleGetServerDetail:", error);
    }
  };

  const handleGetAllChannels = async () => {
    try {
      const platformType = Plat.PHONE;
      const officeId = await getToken("officeId", platformType);

      if (!officeId) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No office ID found. Please try again.",
        });
        return;
      }

      const res = await getAllChannelForCurrentOffice(officeId, platformType);

      if (res instanceof ApiError) {
        console.log("Channel fetch error:", res.message);
      } else {
        setChannels(res.data);
      }
    } catch (error) {
      console.error("Error in handleGetAllChannels:", error);
    }
  };

  const handleChannelPress = useCallback(
    (channel: ChannelResponse) => {
      setActiveChannelId(channel.id);
      props.navigation.navigate("ChatScreenPhone", {
        channelId: channel.id,
        channelName: channel.name,
      });
      props.navigation.closeDrawer();
    },
    [props.navigation]
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>{serverName}</Text>
      </View>

      <DrawerItemList {...props} />

      <View style={styles.divider} />
      {Platform.OS !== "web" && (
        <Text style={styles.sectionTitle}>Channels</Text>
      )}

      {Platform.OS === "web" ? (
        <ChatChannelList />
      ) : loading ? (
        <ActivityIndicator size="small" style={{ marginTop: 10 }} />
      ) : channels.length > 0 ? (
        channels.map((channel) => (
          <TouchableOpacity
            key={channel.id}
            onPress={() => handleChannelPress(channel)}
            style={[
              styles.channelItem,
              activeChannelId === channel.id && styles.activeChannelItem,
            ]}
          >
            <Text
              style={[
                styles.channelText,
                activeChannelId === channel.id && styles.activeChannelText,
              ]}
            >
              # {channel.name}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noChannelText}>No channels available.</Text>
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 16,
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 40,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 10,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  channelItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  channelText: {
    fontSize: 18,
    color: "#333",
  },
  activeChannelItem: {
    backgroundColor: "#e6f0ff",
  },
  activeChannelText: {
    color: "#1e90ff",
    fontWeight: "bold",
  },
  noChannelText: {
    fontSize: 14,
    color: "#888",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default CustomDrawerContent;
