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
import JwtDecode from "jwt-decode";
import JWT from "expo-jwt";
import socket from "../../../config/Socket";
import { FlatList } from "react-native";

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
  const [messages, setMessages] = useState<Chats[]>([]);

  // const [chats, setChats] = useState<Message[]>([]);

  const handleGetMessage = async () => {
    const res = await fetchChats(activeChannelId);
    console.log(activeChannelId);

    if (res instanceof ApiError) {
      console.log(res.message, "...");
    } else {
      console.log("Chats fetched successfully:", res.data.chats, "-----------");

      setMessages((prevMsg) => [...prevMsg, ...res.data.chats]);

      if (res.data.chats.length > 1) {
        console.log("Additional chat log");
      }
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  // Update messages when the active channel changes
  useEffect(() => {
    setMessages([]);
    handleGetMessage();
    hideBottomNav();
  }, [activeChannelId, hideBottomNav]);

  // Automatically scroll to bottom when new message is added
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (message: Chats) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });

  // Send text message handler
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const userId = await getUserId();
    const newText: Chats = {
      id: timeString,

      userId: userId ?? "",
      message: newMessage,
      channelId: activeChannelId,
      createdAt: new Date(),
      Employee: {
        firstName: "You",
        email: "",
        phoneNumber: "",
        employmentStatus: "Active",
        role: "employee",
        profileImage: "",
      },
    };
    if (socket) {
      socket.emit("sendMessage", newText);
    }
    setMessages([...messages, newText]);
    setNewMessage("");
  };

  // Send photo message handler
  const handlePhotoSend = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const userId = getUserId();
      const newText: Chats = {
        id: Date.now().toLocaleString(),
        userId: (await userId) ?? "",
        message: newMessage,
        channelId: activeChannelId,
        createdAt: new Date(),
        Employee: {
          firstName: "You",
          email: "",
          phoneNumber: "",
          employmentStatus: "Active",
          role: "employee",
          profileImage: "",
        },
      };
      if (socket) {
        socket.emit("sendMessage", newText);
      }
      // const photoMessage = {
      //   id: ,
      //   user: "You",
      //   message: "",
      //   photo: result.assets[0].uri,
      //   timestamp: new Date().toLocaleTimeString(),
      // };
      setMessages([...messages, newText]);
    }
  };

  const getUserId = async (): Promise<string | undefined> => {
    const accessToken = (await getToken("accessToken")) ?? "";
    const decodedToken = JWT.decode(accessToken, null);
    const userId = decodedToken.userId;
    return userId;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.chatContainer}
      keyboardVerticalOffset={80}
    >
      {/* Channel header */}
      <View style={styles.channelHeader}>
        <Text style={styles.channelName}>{activeChannelName}</Text>
      </View>

      <FlatList
        style={styles.messagesContainer}
        data={messages}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageWrapper,
              item.Employee?.firstName === "userId" && styles.myMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.message,
                item.Employee?.firstName === "You" && styles.myMessage,
              ]}
            >
              <View style={styles.messageHeader}>
                <Text style={styles.messageUser}>
                  {item.Employee?.firstName}
                </Text>
                <Text style={styles.messageTime}>
                  {new Date(item.createdAt!).toLocaleTimeString()}
                </Text>
              </View>
              {item.Employee?.profileImage ? (
                <Image
                  source={{ uri: item.Employee.profileImage }}
                  style={{ width: 200, height: 200, borderRadius: 8 }}
                />
              ) : (
                <Text style={styles.messageText}>{item.message}</Text>
              )}
            </View>
          </View>
        )}
        onContentSizeChange={() => {
          // Scroll to the bottom after rendering new content
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: "#FDFDFF",
  },
  channelHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    backgroundColor: "#F7F7F9",
  },
  channelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
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
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    backgroundColor: "#F7F7F9",
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
