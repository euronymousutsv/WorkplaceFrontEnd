// GridCalendarView.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  LayoutAnimation,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/navigationTypes";
import {
  addAccessToChannel,
  createNewChannel,
  getAllChannelForCurrentOffice,
} from "../../../api/server/channelApi";
import { getAllOffices, createOffice } from "../../../api/office/officeApi";
import { getLoggedInUserServer } from "../../../api/server/serverApi";
import { Plat } from "../../../api/auth/token";
import { ApiError } from "../../../api/utils/apiResponse";
import Toast from "react-native-toast-message";

interface Channel {
  id: string;
  name: string;
  newMessages: number;
  isPrivate: boolean;
  highestRoleToAccessChannel?: "admin" | "manager" | "employee";
}

interface OfficeWithChannels {
  officeId: string;
  officeName: string;
  channels: Channel[];
}

const ChatChannelList: React.FC = () => {
  if (Platform.OS !== "web") return null;
  const [groupedChannels, setGroupedChannels] = useState<OfficeWithChannels[]>([]);
  const [expandedOfficeIds, setExpandedOfficeIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [createOfficeModalVisible, setCreateOfficeModalVisible] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newOfficeName, setNewOfficeName] = useState("");
  const [newOfficeAddress, setNewOfficeAddress] = useState("");
  const [newOfficeRadius, setNewOfficeRadius] = useState("");
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);
  const [highestRoleToAccessChannel, setHighestRoleToAccessChannel] = useState<
    "employee" | "manager" | "admin"
  >("employee");
  const [serverId, setServerId] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fetchGroupedChannels = async () => {
    try {
      const serverRes = await getLoggedInUserServer(Plat.WEB);
      if (serverRes instanceof ApiError || !serverRes.data?.joinedServer?.serverId) {
        return;
      }

      const serverId = serverRes.data.joinedServer.serverId;
      setServerId(serverId);

      const officeRes = await getAllOffices({ serverId });
      if (officeRes instanceof ApiError || !Array.isArray(officeRes.data)) {
        return;
      }

      const grouped: OfficeWithChannels[] = [];

      for (const office of officeRes.data) {
        const channelRes = await getAllChannelForCurrentOffice(office.id, Plat.WEB);

        let channels: Channel[] = [];
        if (!(channelRes instanceof ApiError) && Array.isArray(channelRes.data)) {
          channels = channelRes.data.map((channel) => ({
            id: channel.id,
            name: channel.name,
            newMessages: 0,
            isPrivate: false,
            highestRoleToAccessChannel: ["admin", "manager", "employee"].includes(channel.highestRoleToAccessChannel)
    ? (channel.highestRoleToAccessChannel as "admin" | "manager" | "employee")
    : undefined,
          }));
        }

        grouped.push({
          officeId: office.id,
          officeName: office.name,
          channels,
        });
      }

      setGroupedChannels(grouped);
    } catch (err) {
      console.error("Error fetching grouped channels:", err);
    }
  };

  useEffect(() => {
    fetchGroupedChannels();
  }, []);

  // const toggleOffice = (officeId: string) => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setExpandedOfficeIds((prev) =>
  //     prev.includes(officeId)
  //       ? prev.filter((id) => id !== officeId)
  //       : [...prev, officeId]
  //   );
  //   setSelectedOfficeId(officeId);
  // }; 

  const toggleOffice = (officeId: string, officeName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedOfficeIds.includes(officeId)) {
      setExpandedOfficeIds((prev) => prev.filter((id) => id !== officeId));
    } else {
      setExpandedOfficeIds((prev) => [...prev, officeId]);
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !selectedOfficeId || !serverId) return; //not important
    try {
      const createRes = await createNewChannel({ channelName: newChannelName, officeId: selectedOfficeId });
      if (createRes instanceof ApiError || !createRes.data?.id) throw createRes;

      await addAccessToChannel({
        channelId: createRes.data.id,
        highestRoleToAccessServer: highestRoleToAccessChannel,
      });

      setModalVisible(false);
      setNewChannelName("");
      fetchGroupedChannels();
      Toast.show({ type: "success", text1: "Channel Created" });
    } catch {
      Toast.show({ type: "error", text1: "Failed to create channel" });
    }
  };

  const goToOfficeDetail = (officeId: string, officeName: string) => {
    console.log("Navigating to office detail:", officeId, officeName);
    // Uncomment the following line when the navigation is set up
    navigation.navigate("OfficeDetail", { officeId, officeName });
  };

  //via openstreetmap
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
        };
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
    return null;
  };

  const handleCreateOffice = async () => {
    if (!newOfficeName.trim() || !serverId || !newOfficeAddress.trim()) return;

    const coords = await geocodeAddress(newOfficeAddress);
    if (!coords) {
      Toast.show({ type: "error", text1: "Invalid address" });
      return;
    }

    try {
      const res = await createOffice({
        serverId,
        name: newOfficeName,
        lat: coords.lat,
        long: coords.lon,
        radius: parseFloat(newOfficeRadius),
        address: newOfficeAddress,
      });
      if (res instanceof ApiError) throw res;
      setCreateOfficeModalVisible(false);
      setNewOfficeName("");
      setNewOfficeAddress("");
      setNewOfficeRadius("100");
      fetchGroupedChannels();
      Toast.show({ type: "success", text1: "Office Created" });
    } catch {
      Toast.show({ type: "error", text1: "Failed to create office" });
    }
  };


  // const handleCreateOffice = async () => {
  //   if (!newOfficeName.trim() || !serverId) return;
  //   try {
  //     const res = await createOffice({
  //       serverId,
  //       name: newOfficeName,
  //       lat: "1.0000",
  //       long: "1.0000",
  //       radius: 100,
  //       address: "N/A",
  //     });
  //     if (res instanceof ApiError) throw res;
  //     setCreateOfficeModalVisible(false);
  //     setNewOfficeName("");
  //     fetchGroupedChannels();
  //     Toast.show({ type: "success", text1: "Office Created" });
  //   } catch {
  //     Toast.show({ type: "error", text1: "Failed to create office" });
  //   }
  // };

  const getRoleColor = (role: Channel["highestRoleToAccessChannel"]) => {
    switch (role) {
      case "admin": return "#D9534F";
      case "manager": return "#FFA500";
      case "employee": return "#4CAF50";
      default: return "#ccc";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.chatSection}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>Offices</Text>
        <TouchableOpacity onPress={() => setCreateOfficeModalVisible(true)}>
          <Feather name="plus" size={18} color="black" />
        </TouchableOpacity>
      </View>

      {groupedChannels.map((group) => (
        <View key={group.officeId}>
          {/* <TouchableOpacity
            style={styles.officeItem}
            onPress={() => toggleOffice(group.officeId)}
          >
            <Text style={styles.officeName}>{group.officeName}</Text>
            <Feather
              name={expandedOfficeIds.includes(group.officeId) ? "chevron-up" : "chevron-down"}
              size={16}
              color="#555"
            />
          </TouchableOpacity> */}

<View style={styles.officeItem}>
            <TouchableOpacity onPress={() => goToOfficeDetail(group.officeId, group.officeName)}>
              <Text style={styles.officeName}>{group.officeName}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleOffice(group.officeId, group.officeName)}>
              <Feather
                name={expandedOfficeIds.includes(group.officeId) ? "chevron-up" : "chevron-down"}
                size={16}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          {expandedOfficeIds.includes(group.officeId) && (
            <>
              {group.channels.length === 0 ? (
                <Text style={styles.noChannelsText}>No channels. Click '+' to create one.</Text>
              ) : (
                group.channels.map((channel) => (
                  <TouchableOpacity
                    key={channel.id}
                    style={styles.chatItem}
                    onPress={() =>
                      navigation.navigate("ChatScreen", {
                        channelName: channel.name,
                        channelId: channel.id,
                        refreshChannels: fetchGroupedChannels,
                        allChannels: group.channels,
                      })
                    }
                  >
                    <View style={styles.chatLeft}>
                      <Text style={styles.chatHash}>#</Text>
                      <Text style={styles.chatName}>{channel.name}</Text>
                      {channel.highestRoleToAccessChannel && (
                        <View
                          style={{
                            backgroundColor: getRoleColor(channel.highestRoleToAccessChannel),
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            marginLeft: 8,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
                            {channel.highestRoleToAccessChannel.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}

              <TouchableOpacity
                style={styles.addChannelBtn}
                onPress={() => {
                  setModalVisible(true);
                  setSelectedOfficeId(group.officeId);
                }}
              >
                <Text style={styles.addChannelText}>+ Add Channel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ))}

      {/* Create Channel Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Channel</Text>
            <TextInput
              placeholder="Channel Name"
              style={styles.input}
              value={newChannelName}
              onChangeText={setNewChannelName}
            />
            <Text style={styles.modalSubtitle}>Access Role:</Text>
            {(["employee", "manager", "admin"] as const).map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.roleOption, highestRoleToAccessChannel === role && styles.selectedRole]}
                onPress={() => setHighestRoleToAccessChannel(role)}
              >
                <Text>{role}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateChannel}>
                <Text>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

     {/* Create Office Modal */}
     <Modal visible={createOfficeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Office</Text>
            <TextInput
              placeholder="Office Name"
              style={styles.input}
              value={newOfficeName}
              onChangeText={setNewOfficeName}
            />
            <TextInput
              placeholder="Office Address"
              style={styles.input}
              value={newOfficeAddress}
              onChangeText={setNewOfficeAddress}
            />
            <TextInput
              placeholder="Radius (meters)"
              style={styles.input}
              keyboardType="numeric"
              value={newOfficeRadius}
              onChangeText={setNewOfficeRadius}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setCreateOfficeModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateOffice}>
                <Text>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chatSection: {
    padding: 12,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  officeItem: {
    backgroundColor: "#f8f9fb",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  officeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  noChannelsText: {
    fontSize: 14,
    color: "#666",
    paddingLeft: 16,
    paddingVertical: 4,
  },
  chatItem: {
    paddingLeft: 16,
    paddingVertical: 6,
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
    maxWidth: 140,
    flexShrink: 1,
  },
  addChannelBtn: {
    paddingLeft: 16,
    paddingVertical: 6,
  },
  addChannelText: {
    color: "#4A90E2",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "white",
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontWeight: "600",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  roleOption: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 6,
  },
  selectedRole: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default ChatChannelList;
