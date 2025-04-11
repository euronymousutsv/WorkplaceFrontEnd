import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import socket from '../../../config/Socket'; 
import { BackgroundColor, TextColor } from '../../../utils/color';
import { useAuth } from '../../../context/AuthContext'; 
import { changeChannelName, deleteChannel } from '../../../api/server/channelApi';
import Toast from 'react-native-toast-message';
import { ApiError } from '../../../api/utils/apiResponse';

const ChatScreen = ({ route, navigation }: any) => {
  const { channelName: initialChannelName, channelId, refreshChannels } = route.params;
  const [channelName, setChannelName] = useState(initialChannelName);
  const [selectedTab, setSelectedTab] = useState(initialChannelName);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = useRef(new Animated.Value(250)).current;
  const mainContentPadding = useRef(new Animated.Value(250)).current;
  const [isMobile, setIsMobile] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const { userRole } = useAuth();
  const canEdit = userRole === 'admin' || userRole === 'manager';
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newChannelName, setNewChannelName] = useState(initialChannelName);
  const [messages, setMessages] = useState<{ text: string; fromSelf: boolean }[]>([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    socket.on('receive_message', (msg: { text: string; senderId: string }) => {
      const currentUserId = 'your-user-id'; // Replace with actual user ID
      setMessages((prev) => [...prev, { text: msg.text, fromSelf: msg.senderId === currentUserId }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const handleDeleteChannel = () => {
    Alert.alert(
      'Delete Channel',
      `Are you sure you want to delete #${channelName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deleteChannel({ channelId, channelName });
              Toast.show({ type: 'success', text1: 'Channel deleted' });
              navigation.goBack();
            } catch (err) {
              console.error(' Delete error:', err);
              Toast.show({ type: 'error', text1: 'Delete Failed', text2: 'Something went wrong.' });
            }
          },
        },
      ]
    );
  };

  const handleRenameChannel = async () => {
    try {
      const res = await changeChannelName({ channelId, newChannelName });

      if (res instanceof ApiError || !('statusCode' in res) || res.statusCode >= 400) {
        Toast.show({
          type: 'error',
          text1: 'Rename Failed',
          text2: res.message || 'Something went wrong.',
        });
        return;
      }

      Toast.show({ type: 'success', text1: 'Channel renamed' });
      setRenameModalVisible(false);
      setChannelName(newChannelName); // ✅ Update local channel name state
      setSelectedTab(newChannelName);
      navigation.setParams({ channelName: newChannelName });
      await refreshChannels?.();

    } catch (err) {
      console.error('Rename error:', err);
      Toast.show({
        type: 'error',
        text1: 'Unexpected Error',
        text2: 'Could not rename channel.',
      });
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const currentUserId = 'your-user-id'; 

    socket.emit('send_message', { text: message, senderId: currentUserId, channelName });

    setMessages((prev) => [...prev, { text: message, fromSelf: true }]);
    setMessage('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    if (screenWidth <= 768) {
      setIsMobile(true);
      setIsSidebarOpen(false);
    } else {
      setIsMobile(false);
      setIsSidebarOpen(true);
    }
  }, [screenWidth]);

  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: isSidebarOpen ? 250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(mainContentPadding, {
      toValue: isSidebarOpen ? 250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSidebarOpen]);

  return (
    <SafeAreaView style={styles.container}>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} selectedTab={selectedTab} handleTabChange={setSelectedTab} />

      <Animated.View style={[styles.mainContent, { paddingLeft: isMobile ? 0 : mainContentPadding }]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.chatTitleRow}>
            <Text style={styles.chatTitle}>#{channelName}</Text>
            {canEdit && (
              <View style={styles.channelActions}>
                <TouchableOpacity onPress={() => setRenameModalVisible(true)}>
                  <Text style={styles.actionText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteChannel}>
                  <Text style={styles.actionText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer}>
            {messages.map((msg, index) => (
              <View key={index} style={[styles.messageBubble, msg.fromSelf ? styles.messageRight : styles.messageLeft]}>
                <Text style={styles.messageText}>{msg.text}</Text>
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
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>

      <Modal visible={renameModalVisible} transparent animationType="slide" onRequestClose={() => setRenameModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.renameModal}>
            <Text style={styles.modalTitle}>Rename Channel</Text>
            <TextInput style={styles.input} value={newChannelName} onChangeText={setNewChannelName} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setRenameModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleRenameChannel}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: BackgroundColor },
  mainContent: { flex: 1, marginTop: 60, paddingHorizontal: 20, paddingBottom: 20, marginLeft: 30 },
  scrollContainer: { paddingBottom: 80 },
  chatTitle: { fontSize: 24, fontWeight: '700', color: TextColor },
  chatTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  channelActions: { flexDirection: 'row', gap: 12 },
  actionText: { fontSize: 18, color: '#777' },
  renameModal: { backgroundColor: '#FDFDFF', padding: 20, marginHorizontal: 40, borderRadius: 12 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  messageBubble: { maxWidth: '80%', marginVertical: 6, padding: 12, borderRadius: 12 },
  messageLeft: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1' },
  messageRight: { alignSelf: 'flex-end', backgroundColor: '#4A90E2' },
  messageText: { color: '#fff', fontSize: 15 },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderColor: '#ccc', marginTop: 10 },
  input: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 20, fontSize: 15, marginRight: 10 },
  sendButton: { backgroundColor: '#4A90E2', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: '600' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: TextColor, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  cancelButton: { backgroundColor: '#eee' },
  createButton: { backgroundColor: '#4A90E2' },
  buttonText: { fontSize: 15, fontWeight: '600', color: '#333' },
});

export default ChatScreen;