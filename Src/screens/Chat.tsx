import { Button, TextInput } from "react-native";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import socket from "../utils/Socket";
import { useEffect, useState } from "react";

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receive_message"); // Cleanup listener on unmount
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};
export default ChatScreen;
