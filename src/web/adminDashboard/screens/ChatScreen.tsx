import React, { useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";

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
  Platform,
  Modal,
  Image,
  FlatList,
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
import { Feather, Ionicons } from "@expo/vector-icons";
import { Channel } from "../../../types/Channel";
import * as ImagePicker from "expo-image-picker";
import { getToken } from "../../../api/auth/token";
import JWT from "expo-jwt";
import { fetchChats } from "../../../api/chat/chatApi";
import {
  castChatsToMessageData,
  Chats,
  MessageData,
} from "../../../api/chat/chat";
import { uploadFile } from "../../../api/files/fileApi";
import { RefreshControl } from "react-native-gesture-handler";
import dayjs from "dayjs";

const ChatScreen = ({ route, navigation }: any) => {
  const { channelName, channelId, refreshChannels, allChannels } = route.params;
  const [currentChannelName, setCurrentChannelName] = useState(channelName);
  const { userRole } = useAuth();
  const canEdit = userRole === "admin" || userRole === "manager";
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newChannelName, setNewChannelName] = useState(channelName);
  const [userId, setUserId] = useState<string | undefined>();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [uploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

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

  // useEffect(() => {
  //   const join = async () => {
  //     const userId = await getUserId();
  //     socket.emit("join_channel", channelId, userId);
  //   };
  //   join();

  //   socket.on(
  //     "receive_message",
  //     async (data: { text: string; senderId: string }) => {
  //       const currentUserId = await getUserId();
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           text: data.text,
  //           fromSelf: data.senderId === currentUserId,
  //         },
  //       ]);
  //       setTimeout(
  //         () => scrollRef.current?.scrollToEnd({ animated: true }),
  //         100
  //       );
  //     }
  //   );

  //   return () => {
  //     socket.off("receive_message");
  //   };
  // }, [channelId]);

  // useEffect(() => {
  //   setCurrentChannelName(channelName);
  //   setMessages([]);
  //   setNewChannelName(channelName);

  //   const fetchOldMessages = async () => {
  //     try {
  //       const userId = await getUserId();
  //       const res = await fetchChats(channelId);

  //       if (res instanceof ApiError) {
  //         console.error("Failed to fetch chats:", res.message);
  //         return;
  //       }

  //       const formatted = res.data.chats.map((chat: Chats) => ({
  //         text: chat.message ?? "",
  //         fromSelf: chat.userId === userId,
  //         image: chat.imageUrl ?? undefined,
  //       }));
  //       setMessages(formatted.reverse());
  //     } catch (err) {
  //       console.error("Unexpected error fetching messages:", err);
  //     }
  //   };
  //   fetchOldMessages();
  // }, [channelId, channelName]);
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

  const getUserId = async (): Promise<string | undefined> => {
    const accessToken = (await getToken("accessToken")) ?? "";
    const decodedToken = JWT.decode(accessToken, null);
    const userId = decodedToken.userId;
    return userId;
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);
  useEffect(() => {
    // Join the channel
    socket.emit("join_channel", channelId, userId);

    // Listen for incoming messages
    socket.on("receive_message", (data: MessageData) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [channelId]);

  const handleGetMessage = async (page = currentPage) => {
    const res = await fetchChats(channelId, 20, page);
    console.log(channelId);

    if (res instanceof ApiError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
    } else {
      const convertedMessages: MessageData[] = res.data.chats
        .map((chat: Chats) => castChatsToMessageData(chat, channelName))
        .reverse();
      setMessages((prevMsg) => [...convertedMessages, ...prevMsg]);

      if (res.data.chats.length > 1) {
        console.log("Additional chat log");
      }
    }
  };

  const flatListRef = useRef<FlatList>(null);
  // Update messages when the active channel changes
  useEffect(() => {
    setMessages([]);
    handleGetMessage();
  }, [channelId]);

  // Send text message handler
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    if (socket) {
      const newId = uuid.v4();
      const messageData: MessageData = {
        author: {
          id: userId!,
          name: (await getToken("name")) || "",
          profileImage:
            (await getToken("profileImage")) || "/assets/avatar.png",
        },
        channelName: channelName,
        messageId: newId,
        message: newMessage,
        channel: channelId,
        time: new Date(),
        isImage: false,
      };
      setNewMessage("");
      socket.emit("send_message", messageData);
    }
  };

  // Send photo message handler
  const handlePhotoSend = async () => {
    let fileUri: string | null = null;
    let fileType: string | null = null;
    let fileName: string | null = null;
    let fileObject: any;

    try {
      setIsUploading(true);

      if (Platform.OS === "web") {
        // 🌐 Web file input
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        const filePromise = new Promise<File>((resolve, reject) => {
          input.onchange = () => {
            if (input.files && input.files.length > 0) {
              resolve(input.files[0]);
            } else {
              reject(new Error("No file selected"));
            }
          };
        });

        input.click();

        const file = await filePromise;
        fileName = file.name;
        fileType = file.type;

        fileObject = file;
      }

      const formData = new FormData();
      formData.append("file", fileObject);

      const res = await uploadFile(formData, "workhive-chats");

      if (res instanceof ApiError) {
        throw new Error(res.message);
      }

      const newId = uuid.v4();
      const messageData: MessageData = {
        author: {
          id: userId!,
          name: (await getToken("name")) || "",
          profileImage:
            (await getToken("profileImage")) || "/assets/avatar.png",
        },
        channelName: channelName,
        messageId: newId,
        message: res.fileUrl,
        channel: channelId,
        time: new Date(),
        isImage: true,
      };

      setNewMessage("");
      socket.emit("send_message", messageData);
    } catch (error) {
      console.error("Error uploading file:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to upload image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingMore}
              onRefresh={() => {
                setIsLoadingMore(true);
                setCurrentPage((prevPage) => {
                  const nextPage = prevPage + 1;
                  handleGetMessage(nextPage);
                  setIsLoadingMore(false);
                  return nextPage;
                });
              }}
            />
          }
          ref={flatListRef}
          style={[styles.messagesContainer]}
          data={messages}
          keyExtractor={(item, index) => item.messageId || index.toString()}
          renderItem={({ item, index }) => {
            const isMyMessage = userId === item.author?.id;
            const isSameSenderAsPrev =
              index > 0 && messages[index - 1].author?.id === item.author?.id;

            return (
              <View
                style={[
                  styles.messageRow,
                  isMyMessage && { justifyContent: "flex-end" },
                ]}
              >
                {/* Avatar or empty space */}
                {!isMyMessage ? (
                  isSameSenderAsPrev ? (
                    <View style={styles.avatarSpacer} />
                  ) : (
                    <Image
                      source={{
                        uri: item.author?.profileImage
                          ? item.author?.profileImage
                          : "./assets/avatar.png",
                      }}
                      style={styles.avatar}
                    />
                  )
                ) : null}

                {/* Message content */}
                {item.isImage ? (
                  <View
                    style={[
                      styles.messageWrapper,
                      isMyMessage && styles.myMessageWrapper,
                    ]}
                  >
                    {!isMyMessage && !isSameSenderAsPrev && (
                      <View style={styles.messageHeader}>
                        <Text style={styles.messageUser}>
                          {item.author?.name}
                        </Text>
                        <Text style={styles.messageTime}>
                          {dayjs(item.time).format("hh:mm A")}
                        </Text>
                      </View>
                    )}
                    {isMyMessage && !isSameSenderAsPrev && (
                      <Text style={styles.messageTimeMine}>
                        {dayjs(item.time).format("hh:mm A")}
                      </Text>
                    )}
                    <Image
                      source={{ uri: item.message }}
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.messageWrapper,
                      isMyMessage && styles.myMessageWrapper,
                    ]}
                  >
                    {!isMyMessage && !isSameSenderAsPrev && (
                      <View style={styles.messageHeader}>
                        <Text style={styles.messageUser}>
                          {item.author?.name}
                        </Text>
                        <Text style={styles.messageTime}>
                          {dayjs(item.time).format("hh:mm A")}
                        </Text>
                      </View>
                    )}
                    {isMyMessage && !isSameSenderAsPrev && (
                      <Text style={styles.messageTimeMine}>
                        {dayjs(item.time).format("hh:mm A")}
                      </Text>
                    )}
                    <View
                      style={[styles.message, isMyMessage && styles.myMessage]}
                    >
                      <Text style={styles.messageText}>{item.message}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
          onContentSizeChange={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />

        {uploading && (
          <View>
            <Text style={styles.emptyChatText}>Uploading your image...</Text>
          </View>
        )}

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
                  <Text style={[styles.buttonText, { color: "#fff" }]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          textContentType="none"
          value={newMessage}
          onChangeText={setNewMessage}
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePhotoSend} style={styles.photoButton}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  photoButton: {
    marginLeft: 10,
    padding: 12,
    backgroundColor: "#4A90E2",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    paddingVertical: 10,
    borderTopColor: "#EFEFEF",
    backgroundColor: "#fff",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // extra space for input bar
    marginLeft: 30,
  },
  messagesContainer: {
    flex: 1,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  avatarSpacer: {
    width: 40,
    height: 40,
  },
  messageWrapper: {
    marginLeft: 10,
    maxWidth: "90%",
  },
  myMessageWrapper: {
    marginLeft: "auto",
    alignSelf: "flex-end",
  },
  message: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#F0F7FF",
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  messageUser: {
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  messageTime: {
    fontSize: 10,
    color: "#8E9196",
  },
  messageTimeMine: {
    fontSize: 10,
    color: "#8E9196",
    marginLeft: "auto",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: "#333",
  },
  emptyChatText: {
    color: "#8E9196",
    fontSize: 16,
    marginVertical: 10,
  },
  inputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FDFDFF",
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
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  iconButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: TextColor,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
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
});

export default ChatScreen;
