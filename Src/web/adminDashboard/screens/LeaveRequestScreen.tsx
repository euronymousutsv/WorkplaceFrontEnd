// LeaveRequestScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  balance: number;
  totalDays: number;
  history?: LeaveRequest[];
  adminComment?: string;
}

const initialRequests: LeaveRequest[] = [
  {
    id: 'LEAVE001',
    employeeId: 'EMP001',
    employeeName: 'Sabin',
    leaveType: 'Annual Leave',
    startDate: '2024-04-10',
    endDate: '2024-04-15',
    reason: 'Family trip',
    status: 'Pending',
    balance: 10,
    totalDays: 5,
    history: [],
    adminComment: '',
  },
  {
    id: 'LEAVE002',
    employeeId: 'EMP002',
    employeeName: 'Pranish',
    leaveType: 'Sick Leave',
    startDate: '2024-04-05',
    endDate: '2024-04-06',
    reason: 'Fever',
    status: 'Approved',
    balance: 6,
    totalDays: 2,
    history: [],
    adminComment: '',
  },
];

const LeaveRequestScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('LeaveRequestScreen');
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [search, setSearch] = useState('');
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [selectedAction, setSelectedAction] = useState<'Approved' | 'Rejected' | null>(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<LeaveRequest[] | null>(null);

  const handleUpdateStatus = (id: string, action: 'Approved' | 'Rejected') => {
    setSelectedRequestId(id);
    setSelectedAction(action);
    setCommentModalVisible(true);
  };

  const confirmStatusUpdate = () => {
    if (!selectedRequestId || !selectedAction) return;

    setRequests(prev =>
      prev.map(r => {
        if (r.id === selectedRequestId) {
          const historyEntry = { ...r };
          return {
            ...r,
            status: selectedAction,
            adminComment,
            history: [...(r.history || []), historyEntry],
          };
        }
        return r;
      })
    );

    setCommentModalVisible(false);
    setAdminComment('');
    setSelectedRequestId(null);
    setSelectedAction(null);
  };

  const filtered = requests.filter(r =>
    r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  const openHistory = (history: LeaveRequest[] | undefined) => {
    if (history && history.length > 0) {
      setSelectedHistory(history);
      setHistoryModalVisible(true);
    } else {
      Alert.alert('No history found for this request.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} selectedTab={selectedTab} handleTabChange={setSelectedTab} />
      <View style={[styles.mainContent, { marginLeft: isSidebarOpen ? 250 : 0 }]}>
        <Text style={styles.title}>Leave Requests</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by Employee Name or Request ID"
          value={search}
          onChangeText={setSearch}
        />
        <ScrollView horizontal>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {['ID', 'Name', 'Leave Type', 'Dates', 'Days', 'Reason', 'Balance', 'Status', 'Admin Comment', 'Actions'].map(h => (
                <Text style={styles.headerCell} key={h}>{h}</Text>
              ))}
            </View>
            {filtered.map(r => (
              <View key={r.id} style={styles.row}>
                <Text style={styles.cell}>{r.id}</Text>
                <Text style={styles.cell}>{r.employeeName}</Text>
                <Text style={styles.cell}>{r.leaveType}</Text>
                <Text style={styles.cell}>{`${r.startDate} - ${r.endDate}`}</Text>
                <Text style={styles.cell}>{r.totalDays}</Text>
                <Text style={styles.cell}>{r.reason}</Text>
                <Text style={styles.cell}>{r.balance}</Text>
                <Text style={[styles.cell, (styles as any)[r.status.toLowerCase()]]}>{r.status}</Text>
                <Text style={styles.cell}>{r.adminComment || '-'}</Text>
                <View style={styles.cell}>
                  {r.status === 'Pending' ? (
                    <>
                      <TouchableOpacity onPress={() => handleUpdateStatus(r.id, 'Approved')}><Text style={{ color: 'green' }}>Approve</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => handleUpdateStatus(r.id, 'Rejected')}><Text style={{ color: 'red' }}>Reject</Text></TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity onPress={() => openHistory(r.history)}>
                      <Text style={{ color: '#4A90E2' }}>View History</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <Modal visible={commentModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '90%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Add Admin Comment</Text>
            <TextInput
              placeholder="Enter comment..."
              value={adminComment}
              onChangeText={setAdminComment}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, height: 80, marginBottom: 10 }}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)} style={{ marginRight: 10 }}>
                <Text style={{ color: 'red' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmStatusUpdate}>
                <Text style={{ color: 'green' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={historyModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '90%', maxHeight: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Leave History</Text>
            <ScrollView>
              {selectedHistory?.map((h, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text><Text style={{ fontWeight: 'bold' }}>Type:</Text> {h.leaveType}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Dates:</Text> {h.startDate} - {h.endDate}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Days:</Text> {h.totalDays}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Status:</Text> {h.status}</Text>
                  <Text><Text style={{ fontWeight: 'bold' }}>Comment:</Text> {h.adminComment || '-'}</Text>
                </View>
              )) || <Text>No history available.</Text>}
            </ScrollView>
            <TouchableOpacity onPress={() => setHistoryModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: 'red', textAlign: 'right' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, padding: 20, marginTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  table: { minWidth: 1200 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
  cell: { flex: 1, textAlign: 'center' },
  pending: { backgroundColor: '#f39c12', color: 'white', padding: 4, borderRadius: 4 },
  approved: { backgroundColor: '#2ecc71', color: 'white', padding: 4, borderRadius: 4 },
  rejected: { backgroundColor: '#e74c3c', color: 'white', padding: 4, borderRadius: 4 },
});

export default LeaveRequestScreen;
