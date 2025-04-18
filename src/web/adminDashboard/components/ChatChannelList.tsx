import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Switch,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
  addAccessToChannel,
  createNewChannel,
  getAllChannelForCurrentServer,
} from "../../../api/server/channelApi";
import { getToken, Plat, saveToken } from "../../../api/auth/token";
import { getLoggedInUserServer } from "../../../api/server/serverApi";
import { ApiError } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";

interface Channel {
  id: string;
  name: string;
  newMessages: number;
  isPrivate: boolean;
  highestRoleToAccessChannel?: "admin" | "manager" | "employee";
}

const ChatChannelList: React.FC = () => {
  if (Platform.OS !== "web") return null;
  const [channels, setChannels] = useState<Channel[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [highestRoleToAccessChannel, setHighestRoleToAccessChannel] = useState<
    "employee" | "manager" | "admin"
  >("employee");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, keyof RootStackParamList>>();
  const [serverId, setServerId] = useState<string | null>(null);
  const currentChannel =
    route.name === "ChatScreen" && route.params && "channelName" in route.params
      ? route.params.channelName
      : null;

  // const fetchServerId = async () => {
  //   const token = await getToken("accessToken", Plat.WEB);
  //   console.log("Acess token:", token);
  //   try {
  //     const res = await getLoggedInUserServer(Plat.WEB);
  //     console.log("getLoggedInUserServer response:", res);

  //     if (res instanceof ApiError) {
  //       Toast.show({
  //         type: "error",
  //         text1: "Server ID Error",
  //         text2: res.message,
  //       });
  //     } else if ("statusCode" in res && "data" in res && res.data.serverId) {
  //       console.log(" Server ID found:", res.data.serverId);
  //       setServerId(res.data.serverId);
  //       saveToken("serverId", res.data.serverId, Plat.WEB);
  //       await fetchChannels(res.data.serverId);
  //     } else {
  //       console.warn("⚠️ Server ID not found in response data");
  //     }
  //   } catch (err) {
  //     console.error(" Unexpected error in fetchServerId:", err);
  //   }
  // };

  useEffect(() => {
    // fetchServerId();
  }, []);

  //   const handleCreateChannel = () => {
  //     if (newChannelName.trim()) {
  //       const newChannel = {
  //         name: newChannelName,
  //         newMessages: 0,
  //         isPrivate,
  //         highestRoleToAccessChannel,
  //       };
  //       setChannels([...channels, newChannel]);
  //       setNewChannelName('');
  //       setIsPrivate(false);
  //       setModalVisible(false);
  //     }
  //   };

  const fetchChannels = async (serverId: string) => {
    try {
      const res = await getAllChannelForCurrentServer(serverId, Plat.WEB);
      console.log("📥 Channels fetched from server:", res);

      if (res instanceof ApiError) {
        Toast.show({
          type: "error",
          text1: "Failed to Load Channels",
          text2: res.message || "Something went wrong.",
        });
      } else if ("data" in res && Array.isArray(res.data)) {
        const parsedChannels = res.data.map((channel) => ({
          id: channel.id,
          name: channel.name,
          newMessages: 0,
          isPrivate: false, // Optional: Adjust based on your API
          highestRoleToAccessChannel: channel.highestRoleToAccessChannel as
            | "admin"
            | "manager"
            | "employee",
        }));

        setChannels(parsedChannels);
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid Response",
          text2: "Unexpected format from channel API.",
        });
      }
    } catch (err) {
      console.error("❌ Unexpected error while fetching channels:", err);
      Toast.show({
        type: "error",
        text1: "Fetch Error",
        text2: "Could not load channels.",
      });
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) {
      Toast.show({
        type: "error",
        text1: "Channel Name Required",
        text2: "Please enter a valid channel name.",
      });
      return;
    }

    try {
      // Step 1: Get the server ID
      const serverId = await getToken("serverId", Plat.WEB);
      console.log("📦 Retrieved serverId:", serverId);

      if (!serverId) {
        Toast.show({
          type: "error",
          text1: "Server ID Missing",
          text2: "Could not find your server context.",
        });
        return;
      }

      // Step 2: Create channel
      const createRes = await createNewChannel({
        channelName: newChannelName,
        serverId,
      });

      console.log("createRes:", createRes);

      if (
        createRes instanceof ApiError ||
        !("data" in createRes) ||
        !createRes.data?.id
      ) {
        console.warn("⚠️ Channel creation response invalid:", createRes);
        Toast.show({
          type: "error",
          text1: "Channel Creation Failed",
          text2: createRes.message || "Something went wrong.",
        });
        return;
      }

      const createdChannel = createRes.data;
      console.log("✅ Channel created:", createdChannel);

      // Step 3: Assign access permissions
      const accessRes = await addAccessToChannel({
        channelId: createdChannel.id,
        highestRoleToAccessServer: highestRoleToAccessChannel,
      });

      console.log("🔐 accessRes:", accessRes);

      if (
        accessRes instanceof ApiError ||
        !("statusCode" in accessRes) ||
        accessRes.statusCode >= 400
      ) {
        console.warn("⚠️ Access control failed:", accessRes);
        Toast.show({
          type: "error",
          text1: "Access Setup Failed",
          text2: accessRes.message || "Could not assign role access.",
        });
        return;
      }

      // Step 4: Success
      setChannels([
        ...channels,
        {
          id: createdChannel.id,
          name: newChannelName,
          newMessages: 0,
          isPrivate,
          highestRoleToAccessChannel,
        },
      ]);

      setNewChannelName("");
      setIsPrivate(false);
      setModalVisible(false);

      Toast.show({
        type: "success",
        text1: "Channel Created",
        text2: `${newChannelName} added successfully.`,
      });

      console.log("🎉 Channel added to UI successfully.");
    } catch (err) {
      console.error("❌ Unexpected error in handleCreateChannel:", err);
      Toast.show({
        type: "error",
        text1: "Unexpected Error",
        text2: "Something went wrong. Please try again.",
      });
    }
  };

  //   const getRoleAccessLabel = (role: 'admin' | 'manager' | 'employee' | undefined) => {
  //     if (!role) return '';
  //     switch (role) {
  //       case 'employee':
  //         return 'all roles';
  //       case 'manager':
  //         return 'managers and admins';
  //       case 'admin':
  //         return 'admins only';
  //       default:
  //         return '';
  //     }
  //   };

  const getRoleColor = (role: "admin" | "manager" | "employee" | undefined) => {
    switch (role) {
      case "admin":
        return "#D9534F"; // red
      case "manager":
        return "#FFA500"; // orange
      case "employee":
        return "#4CAF50"; // green
      default:
        return "#ccc";
    }
  };

  return (
    <View style={styles.chatSection}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>Channels</Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addChannelButton}
        >
          <Feather name="plus" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {/* Channel List */}
     
        {channels.length === 0 ? (
          <Text style={{ color: "#666", padding: 10, fontSize: 14 }}>
            No channels. Click '+' to create one.
          </Text>
        ) : (
        channels.map((channel, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chatItem,
              currentChannel === channel.name && styles.activeChatItem,
            ]}
            onPress={() => {
              // navigation.navigate("ChatScreen", {
              //   channelName: channel.name,
              //   channelId: channel.id,
              //   refreshChannels: fetchServerId,
              //   allChannels: channels,
              // });
            }}
          >
            <View style={styles.chatLeft}>
              <Text style={styles.chatHash}>#</Text>
              <Text style={styles.chatName} numberOfLines={1}>
                {channel.name.length > 14
                  ? `${channel.name.slice(0, 12)}..`
                  : channel.name}
              </Text>
              {channel.isPrivate && (
                <Feather name="lock" size={14} style={styles.chatLock} />
              )}
            </View>
            {/* Role hint line */}
            {/* {channel.highestRoleToAccessChannel && (
        <Text style={styles.roleHint}>
        🔒 Accessible by {getRoleColor(channel.highestRoleToAccessChannel)}
      </Text>
      
      )} */}
            {/* Role color badge */}
            {/* Role letter badge */}
            {channel.highestRoleToAccessChannel && (
              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor: getRoleColor(
                      channel.highestRoleToAccessChannel
                    ),
                  },
                ]}
              >
                <Text style={styles.roleLetterText}>
                  {channel.highestRoleToAccessChannel.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            {channel.newMessages > 0 && (
              <Text style={styles.newMessageText}>
                {channel.newMessages} new
              </Text>
            )}
          </TouchableOpacity>
        )))}
      

      {/* Create Channel Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Channel</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter channel name"
              value={newChannelName}
              onChangeText={setNewChannelName}
              placeholderTextColor="#888"
            />

            <View style={styles.roleSelectContainer}>
              <Text style={styles.switchLabel}>Minimum Role Required:</Text>
              {["employee", "manager", "admin"].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    highestRoleToAccessChannel === role &&
                      styles.roleOptionActive,
                  ]}
                  onPress={() => setHighestRoleToAccessChannel(role as any)}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      highestRoleToAccessChannel === role && { color: "#fff" },
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Private Channel</Text>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: "#ccc", true: "#4A90E2" }}
                thumbColor={isPrivate ? "#fff" : "#fff"}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreateChannel}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  chatSection: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  chatTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "black",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  addChannelButton: {
    
    padding: 4,
  },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#ffffff",
  },
  chatLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  chatHash: {
    color: "#4A90E2",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 4,
  },
  chatName: {
    fontSize: 15,
    color: "#333",
    maxWidth: 120,
  },
  chatLock: {
    marginLeft: 4,
    color: "#777",
  },
  newMessageText: {
    fontSize: 11,
    color: "#4A90E2",
    backgroundColor: "#e0ecff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 15,
    color: "#333",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 15,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  createButton: {
    backgroundColor: "#4A90E2",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  activeChatItem: {
    backgroundColor: "#88B6EC", // soft blue
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  roleSelectContainer: {
    marginBottom: 20,
  },
  roleOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 6,
    backgroundColor: "#f5f5f5",
  },
  roleOptionActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  roleOptionText: {
    color: "#333",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  roleHint: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },
  roleBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  roleLetterText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ChatChannelList;
