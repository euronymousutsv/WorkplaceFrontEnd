import React, { useEffect, useState } from "react";
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
import {
  getAllChannelForCurrentOffice,
  getAllChannelForCurrentServer,
} from "../../../api/server/channelApi";
import Toast from "react-native-toast-message";
import { AllOfficesResponse } from "../../../api/office/officeResponse";
import { getAllOffices } from "../../../api/office/officeApi";

const CustomDrawerContent = (props: any) => {
  const [serverName, setServerName] = useState("");
  const [loading, setLoading] = useState(true);

  // channels state
  const [channels, setChannels] = useState<ChannelResponse[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);

  // offices state
  const [offices, setOffices] = useState<AllOfficesResponse[] | null>([]);
  const [activeOffice, setActiveOffice] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await handleGetServerDetail(); // Save serverId token
      await handleGetAllOffices(); // Fetch all offices
      await handleGetAllChannels(); // Fetch channels with saved serverId
      setLoading(false);
    })();
  }, []);

  const handleGetServerDetail = async () => {
    const platformType = Platform.OS === "web" ? Plat.WEB : Plat.PHONE;

    const res = await getLoggedInUserServer(platformType);

    if (res instanceof ApiError) {
      console.log("Server fetch error:", res.message);
    } else if ("statusCode" in res && "data" in res) {
      const serverId = res.data.joinedServer.serverId;
      const officeId = res.data?.searchedOffice?.officeId || "";
      setServerName(res.data.joinedServer.name);
      console.log(res.data);

      await saveToken("serverId", serverId, platformType);
      await saveToken("officeId", officeId, platformType);
    } else {
      console.log("Something went wrong while fetching server.");
    }
  };

  const handleGetAllChannels = async () => {
    const platformType = Platform.OS === "web" ? Plat.WEB : Plat.PHONE;

    let officeId;
    if (platformType === Plat.PHONE) {
      officeId = await getToken("officeId", platformType);
      if (!officeId) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No office ID found. Please try again.",
        });
        return;
      }
    }

    const res = await getAllChannelForCurrentOffice(officeId!, platformType);
    if (res instanceof ApiError) {
      console.log("Channel fetch error:", res.message);
    } else {
      setChannels(res.data);
    }
  };

  const handleGetAllOffices = async () => {
    const platformType = Platform.OS === "web" ? Plat.WEB : Plat.PHONE;

    if (platformType === Plat.PHONE) {
      return;
    }
    const serverId = await getToken("serverId", platformType);

    // fetchs all offices within a server
    const res = await getAllOffices({ serverId: serverId! });

    if (res instanceof ApiError) {
      console.log("Offices fetch error:", res.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch offices.",
      });
    } else {
      setOffices(res.data);
    }
  };

  const handleChannelPress = (channel: ChannelResponse) => {
    props.navigation.navigate(
      Platform.OS === "web" ? "ChatScreen" : "ChatScreenPhone",
      {
        channelId: channel.id,
        channelName: channel.name,
      }
    );
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>{serverName}</Text>
      </View>

      <DrawerItemList {...props} />

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Channels</Text>

      {offices?.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            console.log("Pressed office:", item.name);
            setActiveOffice(item.id);
            handleGetAllChannels(); // optionally refetch channels for this office
          }}
          style={[
            styles.channelItem,
            activeOffice === item.id && styles.activeChannelItem,
          ]}
        >
          <Text
            style={[
              styles.channelText,
              activeOffice === item.id && styles.activeChannelText,
            ]}
          >
            🏢 {item.name}
          </Text>
        </TouchableOpacity>
      ))}

      {loading ? (
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
