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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { fetchChats } from "../../../api/chat/chatApi";
import { ApiError } from "../../../api/utils/apiResponse";
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
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);

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

  const handleGetMessage = async () => {
    const res = await fetchChats(activeChannelId);
    console.log(activeChannelId);

    if (res instanceof ApiError) {
      console.log(res.message, "...");
    } else {
      console.log("Chats fetched successfully:", res.data.chats, "-----------");
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

  // Automatically scroll to bottom when new message is added
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  // Send text message handler
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userId = await getUserId();

    if (socket) {
      const newId = uuid.v4();
      const messageData: MessageData = {
        author: {
          id: userId!,
          name: (await getToken("name")) || "",
          profileImage:
            (await getToken("profileImage")) ||
            "https://cdn.pixabay.com/photo/2025/04/08/10/42/landscape-9521261_960_720.jpg",
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
  // const handlePhotoSend = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ["images", "videos"],
  //     allowsEditing: true,
  //     quality: 0.8,
  //   });

  //   if (!result.canceled && result.assets && result.assets[0].uri) {
  //     const userId = getUserId();
  //     const newText: Chats = {
  //       id: Date.now().toLocaleString(),
  //       userId: (await userId) ?? "",
  //       message: newMessage,
  //       channelId: activeChannelId,
  //       createdAt: new Date(),
  //       Employee: {
  //         firstName: "You",
  //         email: "",
  //         phoneNumber: "",
  //         employmentStatus: "Active",
  //         role: "employee",
  //         profileImage: "",
  //       },
  //     };
  //     if (socket) {
  //       socket.emit("sendMessage", newText);
  //     }
  //     // const photoMessage = {
  //     //   id: ,
  //     //   user: "You",
  //     //   message: "",
  //     //   photo: result.assets[0].uri,
  //     //   timestamp: new Date().toLocaleTimeString(),
  //     // };
  //     setMessages([...messages, newText]);
  //   }
  // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.chatContainer}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        style={styles.messagesContainer}
        data={messages}
        keyExtractor={(item, index) => item.messageId || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBox}>
            {item.author?.profileImage ? (
              <Image
                source={{ uri: item.author?.profileImage }}
                style={{ width: 40, height: 40, borderRadius: 8 }}
              />
            ) : (
              <Text style={styles.messageText}>Image not found</Text>
            )}
            <View
              style={[
                styles.messageWrapper,
                item.author?.name === "userId" && styles.myMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.message,
                  item.author?.name === "You" && styles.myMessage,
                ]}
              >
                <View style={styles.messageHeader}>
                  <View>
                    <Text style={styles.messageUser}>{item.author?.name}</Text>
                    <Text style={styles.messageTime}>
                      {dayjs(item.time).format("HH:mm")}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.messageText}>{item.message}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        onContentSizeChange={() => {
          // Scroll to the bottom after rendering new content
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }}
        // Additional FlatList props to improve scrolling performance
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
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // handlePhotoSend
          }}
          style={styles.photoButton}
        >
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  messageBox: {
    flex: 1,
    flexDirection: "row",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#FDFDFF",
    paddingTop: 16,
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
    marginBottom: 16,
    marginLeft: 10,
  },
  myMessageWrapper: {
    alignSelf: "flex-end",
  },
  message: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#F0F7FF",
    maxWidth: "90%",
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    minWidth: 50,
  },
  messageUser: {
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: "#8E9196",
  },
  messageText: {
    color: "#393D3F",
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
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
});

export default ChatWindow;
