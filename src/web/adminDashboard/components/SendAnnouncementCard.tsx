import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { PrimaryColor, TextColor, AccentColor, ButtonRed } from '../../../utils/color';
import { Ionicons } from '@expo/vector-icons';

const roles = ['Admin', 'Manager', 'Employee'];
const dummyUsers = {
  Admin: ['Sabin', 'Pranish', 'Utsav'],
  Manager: ['man', 'women', 'person'],
  Employee: ['student', 'worker', 'intern'],
};

const SendAnnouncementCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!selectedRole || !selectedUser || !message) return;
    console.log('📣 Announcement sent to:', selectedUser, 'Message:', message);
    setModalVisible(false);
    setSelectedRole(null);
    setSelectedUser(null);
    setMessage('');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Send Announcement</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Ionicons name="megaphone" size={20} color="#fff" />
        <Text style={styles.buttonText}>New Announcement</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Create Announcement</Text>

              {/* Role Picker */}
              {/* Role Picker */}
{!selectedRole ? (
  roles.map((role) => (
    <TouchableOpacity
      key={role}
      style={styles.optionButton}
      onPress={() => setSelectedRole(role)}
    >
      <Text style={styles.optionText}>{role}</Text>
    </TouchableOpacity>
  ))
) : (
  <TouchableOpacity
    style={[styles.optionButton, styles.selectedOption]}
    onPress={() => {
      setSelectedRole(null);
      setSelectedUser(null);
    }}
  >
    <Text style={styles.optionText}>Selected: {selectedRole} (Tap to clear)</Text>
  </TouchableOpacity>
)}


              {/* User Picker */}
              {selectedRole &&
                dummyUsers[selectedRole as keyof typeof dummyUsers].map((user) => (
                  <TouchableOpacity
                    key={user}
                    style={[
                      styles.optionButton,
                      selectedUser === user && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedUser(user)}
                  >
                    <Text style={styles.optionText}>{user}</Text>
                  </TouchableOpacity>
                ))}

              {/* Message Input */}
              <TextInput
                placeholder="Write your message here..."
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
              />

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                  <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TextColor,
    marginBottom: 10,
  },
  button: {
    backgroundColor: PrimaryColor,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TextColor,
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: AccentColor,
  },
  optionText: {
    fontSize: 16,
    color: TextColor,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: ButtonRed,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: PrimaryColor,
    padding: 10,
    borderRadius: 8,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SendAnnouncementCard;
