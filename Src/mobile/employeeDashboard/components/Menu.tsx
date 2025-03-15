import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "../../../api/auth/token";
import { getAllChannelForCurrentServer } from "../../../api/server/channelApi";
import { ApiError } from "../../../api/utils/apiResponse";

const { width } = Dimensions.get("window");

// Define channel types
// const channels = [
//   { id: "welcome", name: "# Welcome" },
//   { id: "main", name: "# Main Chat" },
//   { id: "private1", name: "# Private Channel 1" },
// ];

type MenuProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onChannelSelect: (channelId: string, channelName: string) => void;
  activeChannel: string | null;
};

const Menu = ({
  isMenuOpen,
  toggleMenu,
  onChannelSelect,
  activeChannel,
}: MenuProps) => {
  const slideAnimation = new Animated.Value(-width); // Start off-screen to the left
  const [channels, setChannels] = useState([{}]);

  const handleGetAllChannels = async () => {
    const serverId = await getToken("serverId");
    const res = await getAllChannelForCurrentServer(serverId ?? "");

    if (res instanceof ApiError) {
      console.log(res.message);
    } else if ("statusCode" in res && "data" in res) {
      res.data.forEach((channel) => {
        setChannels((prevChannels) => [...prevChannels, channel]);
      });
      console.log(res.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleGetAllChannels();
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (isMenuOpen) {
      Animated.spring(slideAnimation, {
        toValue: 0, // Slide in
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnimation, {
        toValue: -width, // Slide out
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuOpen]);

  return (
    <Animated.View
      style={[styles.menu, { transform: [{ translateX: slideAnimation }] }]}
    >
      <View style={styles.menuContent}>
        {/* Header with Close Button */}
        <View style={styles.headerContainer}>
          <Text style={styles.menuHeader}>Channels</Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Ionicons
              style={styles.closeButtonIcon}
              name="close-outline"
              size={34}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Menu Items - Made clickable */}

        {channels.map((channel) => (
          <TouchableOpacity
            key={channel.id}
            style={[
              styles.menuItemContainer,
              activeChannel === channel.id && styles.activeMenuItem,
            ]}
            onPress={() => {
              onChannelSelect(channel.id, channel.name);
              toggleMenu();
            }}
          >
            <Text
              style={[
                styles.menuItem,
                activeChannel === channel.id && styles.activeMenuItemText,
              ]}
            >
              {channel.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    top: 47,
    left: 0,
    bottom: 0,
    backgroundColor: "#FDFDFF",
    height: "92%", // Make sure it's covering most of the screen
    width: "60%", // Half width of the screen
    borderRadius: 20,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    zIndex: 10, // Make sure it appears above other components
  },
  menuContent: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row", // Align elements side by side
    justifyContent: "space-between", // Space them out
    alignItems: "center", // Vertically align items in the header
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: "flex-end", // Position close button to the top-right
  },
  closeButtonIcon: {
    color: "#4A90E2",
  },
  menuItemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  activeMenuItem: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
  },
  menuItem: {
    fontSize: 18,
    color: "#393D3F",
  },
  activeMenuItemText: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  menuHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#393D3F", // Set text color for header
  },
});

export default Menu;
