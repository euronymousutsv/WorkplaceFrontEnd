import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Image,
} from "react-native";
import Sidebar from "../components/Sidebar";
// import Header from '../components/Header';
import socket from "../../../config/Socket";
import { BackgroundColor, TextColor } from "../../../utils/color";
import { useAuth } from "../../../context/AuthContext";
import {
  changeChannelName,
  deleteChannel,
} from "../../../api/server/channelApi";
import Toast from "react-native-toast-message";
import { ApiError } from "../../../api/utils/apiResponse";
import { Feather } from "@expo/vector-icons";
import { Channel } from "../../../types/Channel";
import * as ImagePicker from "expo-image-picker";
import { getToken } from "../../../api/auth/token";
import JWT from "expo-jwt";
import { fetchChats } from "../../../api/chat/chatApi";
import { Chats } from "../../../api/chat/chat";

const ChatScreen = ({ route, navigation }: any) => {
  const { channelName, channelId, refreshChannels, allChannels } = route.params;

  const [currentChannelName, setCurrentChannelName] = useState(channelName);
  // const [selectedTab, setSelectedTab] = useState(channelName);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const sidebarWidth = useRef(new Animated.Value(250)).current;
  // const mainContentPadding = useRef(new Animated.Value(250)).current;
  // const [isMobile, setIsMobile] = useState(false);
  // const screenWidth = Dimensions.get("window").width;
  const { userRole } = useAuth();
  const canEdit = userRole === "admin" || userRole === "manager";
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newChannelName, setNewChannelName] = useState(channelName);
  const [messages, setMessages] = useState<
    { text: string; fromSelf: boolean; image?: string }[]
  >([]);

  const [message, setMessage] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const getUserId = async (): Promise<string | undefined> => {
    const accessToken = (await getToken("accessToken")) ?? "";
    const decodedToken = JWT.decode(accessToken, null);
    return decodedToken.userId;
  };
  

  useEffect(() => {
    navigation.setOptions({
      title: `# ${currentChannelName}`,
      headerRight: () =>
        canEdit ? (
          <View style={{ flexDirection: "row", gap: 16, marginRight: 16 }}>
            <TouchableOpacity onPress={() => setRenameModalVisible(true)}>
              <Feather name="edit" size={20} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteChannel}>
              <Feather name="trash" size={20} color="#D9534F" />
            </TouchableOpacity>
          </View>
        ) : null,
    });
  }, [navigation, currentChannelName, canEdit]);

  useEffect(() => {
    const join = async () => {
      const userId = await getUserId();
      socket.emit("join_channel", channelId, userId);
    };
    join();
  
    socket.on("receive_message", async (data: { text: string; senderId: string }) => {
      const currentUserId = await getUserId();
      setMessages((prev) => [
        ...prev,
        {
          text: data.text,
          fromSelf: data.senderId === currentUserId,
        },
      ]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
  
    return () => {
      socket.off("receive_message");
    };
  }, [channelId]);
  

  
  useEffect(() => {
    setCurrentChannelName(channelName);
    setMessages([]);
    setNewChannelName(channelName);
  
    const fetchOldMessages = async () => {
      try {
        const userId = await getUserId();
        const res = await fetchChats(channelId);
    
        if (res instanceof ApiError) {
          console.error("Failed to fetch chats:", res.message);
          return;
        }
    
        const formatted = res.data.chats.map((chat: Chats) => ({
          text: chat.message??"",
          fromSelf: chat.userId === userId,
          image: chat.imageUrl ?? undefined,
        }));
        setMessages(formatted.reverse());
      } catch (err) {
        console.error("Unexpected error fetching messages:", err);
      }
    };
    fetchOldMessages();
  }, [channelId, channelName]);
  const handleDeleteChannel = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete #${currentChannelName}?`
    );
    if (!confirm) return;

    try {
      const res = await deleteChannel({
        channelId,
        channelName: currentChannelName,
      });

      if (
        res instanceof ApiError ||
        !("statusCode" in res) ||
        res.statusCode >= 400
      ) {
        throw new Error(res.message || "Failed to delete channel");
      }

      await refreshChannels?.();
      Toast.show({ type: "success", text1: "Channel deleted" });

      const remainingChannels = allChannels?.filter(
        (c: Channel) => c.id !== channelId
      );

      if (remainingChannels && remainingChannels.length > 0) {
        const firstChannel = remainingChannels[0];
        navigation.replace("ChatScreen", {
          channelName: firstChannel.name,
          channelId: firstChannel.id,
          refreshChannels,
          allChannels: remainingChannels,
        });
      } else {
        navigation.goBack();
      }
    } catch (err: any) {
      console.error(" Delete error:", err);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: err.message || "Something went wrong.",
      });
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        const base64Image = `data:${selectedAsset.type};base64,${selectedAsset.base64}`;

        // Send via socket or upload it to your server
        socket.emit("send_message", {
          text: "",
          image: base64Image, // send image here
          senderId: "your-user-id",
          channelName: currentChannelName,
        });

        setMessages((prev) => [...prev, { text: "[Image]", fromSelf: true }]);
      }
    } catch (error) {
      console.error("Image pick error:", error);
      Toast.show({ type: "error", text1: "Image pick failed" });
    }
  };

  const handleRenameChannel = async () => {
    try {
      const res = await changeChannelName({ channelId, newChannelName });

      if (
        res instanceof ApiError ||
        !("statusCode" in res) ||
        res.statusCode >= 400
      ) {
        Toast.show({
          type: "error",
          text1: "Rename Failed",
          text2: res.message || "Something went wrong.",
        });
        return;
      }

      Toast.show({ type: "success", text1: "Channel renamed" });
      setRenameModalVisible(false);
      setCurrentChannelName(newChannelName);
      // setSelectedTab(newChannelName);
      navigation.setParams({ channelName: newChannelName, channelId }); // force update
      await refreshChannels?.();
    } catch (err) {
      console.error("Rename error:", err);
      Toast.show({
        type: "error",
        text1: "Unexpected Error",
        text2: "Could not rename channel.",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
  
    const userId = await getUserId();
  
    socket.emit("send_message", {
      text: message,
      senderId: userId,
      channelName: currentChannelName,
    });
  
    setMessages((prev) => [...prev, { text: message, fromSelf: true }]);
    setMessage("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };
  
  // useEffect(() => {
  //   if (screenWidth <= 768) {
  //     setIsMobile(true);
  //     setIsSidebarOpen(false);
  //   } else {
  //     setIsMobile(false);
  //     setIsSidebarOpen(true);
  //   }
  // }, [screenWidth]);

  // useEffect(() => {
  //   Animated.timing(sidebarWidth, {
  //     toValue: isSidebarOpen ? 250 : 0,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();

  //   Animated.timing(mainContentPadding, {
  //     toValue: isSidebarOpen ? 250 : 0,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();
  // }, [isSidebarOpen]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.mainContent,
          // { paddingLeft: isMobile ? 0 : mainContentPadding },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {/* <View style={styles.chatTitleRow}>
            <Text style={styles.chatTitle}>#{currentChannelName}</Text>
            {canEdit && (
              <View style={styles.channelActions}>
                <TouchableOpacity onPress={() => setRenameModalVisible(true)}>
                  <Feather name="edit" size={18} color="#4A90E2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteChannel}>
                  <Feather name="trash" size={18} color="#D9534F" />
                </TouchableOpacity>
              </View>
            )}
          </View> */}

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContainer}
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.fromSelf ? styles.messageRight : styles.messageLeft,
                ]}
              >
                {msg.image ? (
                  <Image
                    source={{ uri: msg.image }}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 8,
                      marginBottom: 5,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.messageText}>{msg.text}</Text>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.iconButton}
            >
              <Feather name="image" size={20} color="#4A90E2" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>

      <Modal
        visible={renameModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.renameModal}>
            <Text style={styles.modalTitle}>Rename Channel</Text>
            <TextInput
              style={styles.input}
              value={newChannelName}
              onChangeText={setNewChannelName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleRenameChannel}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: BackgroundColor,
  },
  mainContent: {
    flex: 1,
    // marginTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginLeft: 30,
  },
  scrollContainer: { paddingBottom: 80 },
  chatTitle: { fontSize: 24, fontWeight: "700", color: TextColor },
  chatTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  channelActions: { flexDirection: "row", gap: 12 },
  actionText: { fontSize: 18, color: "#777" },
  renameModal: {
    backgroundColor: "#FDFDFF",
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  messageBubble: {
    maxWidth: "80%",
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
  },
  messageLeft: { alignSelf: "flex-start", backgroundColor: "#f1f1f1" },
  messageRight: { alignSelf: "flex-end", backgroundColor: "#4A90E2" },
  messageText: { color: "#fff", fontSize: 15 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonText: { color: "#fff", fontWeight: "600" },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: TextColor,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  cancelButton: { backgroundColor: "#eee" },
  createButton: { backgroundColor: "#4A90E2" },
  buttonText: { fontSize: 15, fontWeight: "600", color: "#333" },
  iconButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
