import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryColor, TextColor, AccentColor, ButtonRed } from '../../../utils/color';
import { fetchAllUsers } from '../../../api/server/serverApi'; 
import { ApiError } from '../../../api/utils/apiResponse';
import { Employee } from '../../../api/server/server';
import Toast from 'react-native-toast-message';
import { sendAnnouncementToSelectedUsers } from '../../../api/notifications/notificationApi';

const roles = ['admin', 'manager', 'Individual'] as const;
type Role = typeof roles[number];

const SendAnnouncementCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<Employee[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
        const response = await fetchAllUsers();
        if (!(response instanceof ApiError) && response.data) {
          const employeesOnly: Employee[] = response.data.map((empDetail) => empDetail.Employee);
          setUsers(employeesOnly);
        }
        
    };
    loadUsers();
  }, []);

  const handleUserToggle = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (!selectedRole || selectedUsers.length === 0 || !title.trim() || !message.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Please complete all fields before sending.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
  
    try {
      const userIds = selectedUsers
  
      const response = await sendAnnouncementToSelectedUsers(userIds, title, message);
  
      Toast.show({
        type: 'success',
        text1: 'Announcement sent successfully!',
        position: 'top',
        visibilityTime: 3000,
      });
  
      // Reset form state after sending
      setModalVisible(false);
      setSelectedRole(null);
      setSelectedUsers([]);
      setTitle('');
      setMessage('');
    } catch (error) {
      console.error('Error sending announcement:', error);
  
      Toast.show({
        type: 'error',
        text1: 'Failed to send announcement. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const filteredUsers =
    selectedRole === 'Individual'
      ? users
      : users.filter((u) => u.role.toLowerCase() === selectedRole);

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

              {/* Select Role */}
              <View style={styles.section}>
                <Text style={styles.label}>Choose Role</Text>
                {roles.map((role) =>
                  selectedRole === null || selectedRole === role ? (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.optionButton,
                        selectedRole === role && styles.selectedOption,
                      ]}
                      onPress={() =>
                        selectedRole === role
                          ? setSelectedRole(null)
                          : setSelectedRole(role)
                      }
                    >
                      <Text style={styles.optionText}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ) : null
                )}
              </View>

              {/* Select Users */}
              {selectedRole && (
                <View style={styles.section}>
                  <Text style={styles.label}>Select Recipients</Text>
                  {filteredUsers.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      style={[
                        styles.optionButton,
                        selectedUsers.includes(user.id) && styles.selectedOption,
                      ]}
                      onPress={() => handleUserToggle(user.id)}
                    >
                      <Text style={styles.optionText}>
                        {user.firstName} {user.lastName} ({user.email})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Title */}
              <TextInput
                placeholder="Announcement Title"
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
              />

              {/* Message */}
              <TextInput
                placeholder="Write your message here..."
                style={styles.textArea}
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
              />

              {/* Actions */}
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

export default SendAnnouncementCard;

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
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TextColor,
    marginBottom: 10,
  },
  section: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: TextColor,
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
    marginTop: 12,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 100,
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
