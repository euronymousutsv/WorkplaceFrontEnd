import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Mock data (Replace with backend integration later)
const mockLeaveHistory = [
  { id: '1', type: 'Sick Leave', startDate: '2024-03-05', endDate: '2024-03-07', status: 'Approved' },
  { id: '2', type: 'Vacation', startDate: '2024-04-15', endDate: '2024-04-20', status: 'Pending' },
];

const LeaveScreen: React.FC<{ toggleMenu: () => void; toggleNotification: () => void }> = ({ toggleMenu, toggleNotification }) => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveHistory);

  const handleApplyLeave = () => {
    if (!leaveType || !reason) {
      alert('Please fill in all fields');
      return;
    }
    const newLeave = {
      id: Date.now().toString(),
      type: leaveType,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'Pending',
    };
    setLeaveRequests([...leaveRequests, newLeave]);
    setLeaveType('');
    setReason('');
  };

  return (
    <View style={styles.container}>
      {/* ✅ Header Section */}
      <View style={styles.header}>
        {/* Menu Button (Left Side) */}
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>

        {/* Center Text */}
        <Text style={styles.headerText}>Leave Requests</Text>

        {/* Notification Button (Right Side) */}
        <TouchableOpacity style={styles.notificationButton} onPress={toggleNotification}>
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* ✅ Leave Form Section */}
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Apply for Leave</Text>

        {/* Leave Type Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Leave Type (e.g., Sick Leave, Vacation)"
          value={leaveType}
          onChangeText={setLeaveType}
        />

        {/* Date Pickers */}
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePicker}>
          <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
          <Text style={styles.dateText}>Start Date: {startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePicker}>
          <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
          <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}

        {/* Reason Input */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter Reason"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyLeave}>
          <Text style={styles.applyButtonText}>Apply Leave</Text>
        </TouchableOpacity>

        {/* ✅ Leave History Section */}
        <Text style={styles.sectionTitle}>Leave History</Text>
        {leaveRequests.length > 0 ? (
          leaveRequests.map((leave) => (
            <View key={leave.id} style={styles.leaveCard}>
              <Text style={styles.leaveType}>{leave.type}</Text>
              <Text style={styles.leaveDate}>
                {leave.startDate} - {leave.endDate}
              </Text>
              <Text style={[styles.status, leave.status === 'Approved' ? styles.approved : styles.pending]}>
                {leave.status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noLeaveText}>No leave history available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFF',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    left: 10,
  },
  notificationButton: {
    position: 'absolute',
    right: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#393D3F',
  },
  applyButton: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveCard: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  leaveDate: {
    fontSize: 14,
    color: '#393D3F',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  approved: {
    color: '#2ECC71',
  },
  pending: {
    color: '#F39C12',
  },
  noLeaveText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8E9196',
    marginTop: 20,
  },
});

export default LeaveScreen;
