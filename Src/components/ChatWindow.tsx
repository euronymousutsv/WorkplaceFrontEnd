import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the shape of the messages for each channel
interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

// Define the channels as a type with the correct keys
interface MockMessages {
  welcome: Message[];
  main: Message[];
  private1: Message[];
}

// Mock chat messages
const mockMessages: MockMessages = {
  welcome: [
    { id: '1', user: 'Admin', message: 'Welcome to the main channel!', timestamp: '2023-02-15 08:00' },
    { id: '2', user: 'Employee1', message: 'Hi everyone!', timestamp: '2023-02-15 08:05' },
  ],
  main: [
    { id: '1', user: 'Manager', message: 'Meeting at 10 AM tomorrow!', timestamp: '2023-02-15 08:30' },
    { id: '2', user: 'Employee2', message: 'Got it, thanks!', timestamp: '2023-02-15 08:45' },
  ],
  private1: [
    { id: '1', user: 'Employee3', message: 'I need help with a task.', timestamp: '2023-02-15 09:00' },
    { id: '2', user: 'Employee4', message: 'Sure, what’s the problem?', timestamp: '2023-02-15 09:05' },
  ],
};

type ChatWindowProps = {
  activeChannelId: string;
  activeChannelName: string;
  hideBottomNav: () => void; // Function to hide the bottom navigation when entering chat
};

const ChatWindow = ({ activeChannelId, activeChannelName, hideBottomNav }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages[activeChannelId as keyof MockMessages] || []);
  const [photo, setPhoto] = useState(null); // To store photo if taken
  const [activeChannel, setActiveChannel] = useState<string | null>(null); // Track active channel
  const scrollViewRef = useRef<ScrollView>(null);

  // Update messages when activeChannelId changes
  useEffect(() => {
    setMessages(mockMessages[activeChannelId as keyof MockMessages] || []);
    hideBottomNav();  // Hide bottom navigation when inside the chat
  }, [activeChannelId, hideBottomNav]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return; // Prevent empty messages
    
    // Add new message with timestamp
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    const newMsg = { 
      id: Date.now().toString(), 
      user: 'You', 
      message: newMessage,
      timestamp: timeString
    };
    
    setMessages([...messages, newMsg]); // Add new message to the chat
    setNewMessage(''); // Clear input field
  };

  const handlePhotoSend = () => {
    // Logic to handle photo sending goes here
    // For now, simulate sending a photo by just adding a placeholder message
    const photoMessage = { 
      id: Date.now().toString(), 
      user: 'You', 
      message: 'Photo sent',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([...messages, photoMessage]);
    setPhoto(null);  // Reset photo state after sending
  };

  const handleChannelClick = (channel: string) => {
    // Toggle the active channel when clicked
    if (activeChannel === channel) {
      setActiveChannel(null); // Deactivate the channel if it's already active
    } else {
      setActiveChannel(channel); // Activate the clicked channel
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.chatContainer}
    >
      {/* Channel header */}
      <View style={styles.channelHeader}>
        <Text style={styles.channelName}>{activeChannelName}</Text>
      </View>
      
      <ScrollView 
        style={styles.messagesContainer}
        ref={scrollViewRef}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>No messages yet. Start the conversation!</Text>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View key={msg.id || index} style={styles.messageWrapper}>
              <View style={styles.message}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageUser}>{msg.user}</Text>
                  <Text style={styles.messageTime}>{msg.timestamp}</Text>
                </View>
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
        
        {/* Photo Send Button */}
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
    backgroundColor: '#FDFDFF',
  },
  channelHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#F7F7F9',
  },
  channelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyChatText: {
    color: '#8E9196',
    fontSize: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  message: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F0F7FF',
    maxWidth: '90%',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageUser: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#8E9196',
  },
  messageText: {
    color: '#393D3F',
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#F7F7F9',
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButton: {
    marginLeft: 10,
    padding: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatWindow;
