import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { fetchChats } from "../../../api/chat/chatApi";
import { ApiError, ApiResponse } from "../../../api/utils/apiResponse";
import { getToken } from "../../../api/auth/token";
import JWT from "expo-jwt";
import socket from "../../../config/Socket";
import { FlatList } from "react-native";
import uuid from "react-native-uuid";
import dayjs from "dayjs";
import {
  castChatsToMessageData,
  Chats,
  MessageData,
} from "../../../api/chat/chat";
import Toast from "react-native-toast-message";
import { RefreshControl } from "react-native-gesture-handler";
import { uploadFile } from "../../../api/files/fileApi";
import { themes } from "../screens/MessageThemeScreen";

// Props for ChatWindow component
type ChatWindowProps = {
  activeChannelId: string;
  activeChannelName: string;
  hideBottomNav: () => void;
};

const ChatWindow = ({
  activeChannelId,
  activeChannelName,
  hideBottomNav,
}: ChatWindowProps) => {
  const [userId, setUserId] = useState<string | undefined>();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getUserId = async (): Promise<string | undefined> => {
    const accessToken = (await getToken("accessToken")) ?? "";
    const decodedToken = JWT.decode(accessToken, null);
    const userId = decodedToken.userId;
    return userId;
  };

  useEffect(() => {
    // Join the channel
    // const author: AuthorDetail = { name: "", profileImage: "", id: "" };
    socket.emit("join_channel", activeChannelId, getUserId);

    // Listen for incoming messages
    socket.on("receive_message", (data: MessageData) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [activeChannelId]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);
  const handleGetMessage = async (page = currentPage) => {
    const res = await fetchChats(activeChannelId, 20, page);
    console.log(activeChannelId);

    if (res instanceof ApiError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
    } else {
      const convertedMessages: MessageData[] = res.data.chats
        .map((chat: Chats) => castChatsToMessageData(chat, activeChannelName))
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
    hideBottomNav();
  }, [activeChannelId, hideBottomNav]);

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
        channelName: activeChannelName,
        messageId: newId,
        message: newMessage,
        channel: activeChannelId,
        time: new Date(),
        isImage: false,
      };
      setNewMessage("");
      socket.emit("send_message", messageData);
    }
  };

  // Send photo message handler
  const handlePhotoSend = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      if (socket) {
        const newId = uuid.v4();

        try {
          const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

          if (!fileInfo.exists) {
            throw new Error("File not found at path: " + result.assets[0].uri);
          }

          const fileBlob = {
            uri: result.assets[0].uri,
            type: result.assets[0].type || "image/jpeg",
            name: result.assets[0].fileName || `photo-${Date.now()}.jpg`,
          };

          const formData = new FormData();
          formData.append("file", fileBlob as any);

          const res = await uploadFile(formData, "workhive-chats");

          if (res instanceof ApiError) {
            throw new Error(res.message);
          }

          const messageData: MessageData = {
            author: {
              id: userId!,
              name: (await getToken("name")) || "",
              profileImage:
                (await getToken("profileImage")) || "/assets/avatar.png",
            },
            channelName: activeChannelName,
            messageId: newId,
            message: res.fileUrl,
            channel: activeChannelId,
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
          return;
        }
      }
    }
  };

  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof themes>("blue-pink");
  const [percent, setPercent] = useState<10 | 15 | 20 | 100>(10);

  useEffect(() => {
    const fetchThemeData = async () => {
      const savedTheme = (await getToken(
        "selectedTheme"
      )) as keyof typeof themes;
      const savedPercent = parseInt(
        (await getToken("selectedThemePercent")) || "10",
        10
      ) as 10 | 15 | 20 | 100;

      if (savedTheme && themes[savedTheme]) {
        setSelectedTheme(savedTheme);
      }
      if ([10, 15, 20, 100].includes(savedPercent)) {
        setPercent(savedPercent);
      }
    };

    fetchThemeData();
  }, []);
  return (
    <ImageBackground
      source={themes[selectedTheme][percent]}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={80}
      >
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isLoadingMore}
              onRefresh={() => {
                setIsLoadingMore(true);
                setCurrentPage((prevPage) => {
                  const nextPage = prevPage + 1;
                  handleGetMessage(nextPage); // Pass it explicitly
                  setIsLoadingMore(false);
                  return nextPage;
                });
              }}
            />
          }
          ref={flatListRef}
          style={styles.messagesContainer}
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
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePhotoSend}
            style={styles.photoButton}
          >
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  messageBox: {
    marginBottom: 16,
    flexDirection: "row",
  },
  chatContainer: {
    flex: 1,
    // backgroundColor: "#FDFDFF",
    paddingTop: 16,
    marginTop: 90,
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  messagesContainer: {
    flex: 1,
    padding: 12,
  },
  emptyChat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyChatText: {
    color: "#8E9196",
    fontSize: 16,
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

    marginLeft: "0px",
  },
  messageTimeMine: {
    fontSize: 10,
    color: "#8E9196",
    marginLeft: "auto",
    marginBottom: 4,
  },
  messageText: {
    color: "#393D3F",
    fontSize: 16,
    lineHeight: 22,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 20,
    paddingTop: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 12,
    backgroundColor: "#4A90E2",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
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

  avatarSpacer: {
    width: 40,
    height: 40,
  },
});

export default ChatWindow;
