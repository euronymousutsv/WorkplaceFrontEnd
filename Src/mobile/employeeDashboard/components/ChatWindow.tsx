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
import { Chats, fetchChats } from "../../../api/chatApi";
import { ApiError } from "../../../api/utils/apiResponse";
import { getToken } from "../../../api/auth/token";
import JwtDecode from "jwt-decode";
import JWT from "expo-jwt";
import socket from "../../../config/Socket";

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

    if (res instanceof ApiError) {
      console.log(res.message, "...");
    } else if (Array.isArray(res)) {
      console.log("Chats fetched successfully:", res);
      setMessages((prevMsg) => [...prevMsg, ...res]);

      if (res.length > 1) {
        console.log(res[1], "Additional chat log");
      }
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  // Update messages when the active channel changes
  useEffect(() => {
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
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const userId = getUserId();
    const newText = new Chats({
      id: timeString,
      userId: userId,
      message: newMessage,
      channelId: activeChannelId,
      createdAt: minutes,
      Employee: {
        firstName: "You",
        email: "",
        profileImage: "",
      },
    });
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
      const newText = new Chats({
        id: Date.now().toString(),
        userId: userId,
        message: result.assets[0].uri,
        channelId: activeChannelId,
        createdAt: Date.now(),
        Employee: {
          firstName: "You",
          email: "",
          profileImage: "",
        },
      });
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

      <ScrollView style={styles.messagesContainer} ref={scrollViewRef}>
        {messages.map((msg, index) => (
          <View
            key={msg.id || index}
            style={[
              styles.messageWrapper,
              msg.Employee?.firstName === "userId" && styles.myMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.message,
                msg.Employee?.firstName === "You" && styles.myMessage,
              ]}
            >
              <View style={styles.messageHeader}>
                <Text style={styles.messageUser}>
                  {msg.Employee?.firstName}
                </Text>
                <Text style={styles.messageTime}>
                  {new Date(msg.createdAt!).toLocaleTimeString()}
                </Text>
              </View>
              {msg.Employee?.profileImage ? (
                <Image
                  source={{ uri: msg.Employee.profileImage }}
                  style={{ width: 200, height: 200, borderRadius: 8 }}
                />
              ) : (
                <Text style={styles.messageText}>{msg.message}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

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
