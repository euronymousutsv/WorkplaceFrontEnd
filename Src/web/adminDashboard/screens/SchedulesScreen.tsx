// SchedulesScreen.tsx (Pro Version)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import GridCalendarView from '../components/schedule/GridCalendarView';
import WebScheduleModal from '../components/schedule/WebScheduleModal'
// import FilterControls from '../components/FilterControls';

const initialSchedules = [
  {
    id: 1,
    employee: 'Sabin',
    start: '2025-04-10T09:00:00',
    end: '2025-04-10T17:00:00',
    location: 'Melbourne',
    desc: 'Morning shift',
  },
  {
    id: 2,
    employee: 'Pranish',
    start: '2025-04-11T22:00:00',
    end: '2025-04-12T06:00:00',
    location: 'Sydney',
    desc: 'Night shift',
  },
];

const employees = ['Sabin', 'Pranish', 'Aashish'];
const locations = ['Melbourne', 'Sydney', 'Brisbane'];

const SchedulesScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'auto'>('calendar');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [schedules, setSchedules] = useState(initialSchedules);
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [editingShift, setEditingShift] = useState<any | null>(null);

  const isMobile = Dimensions.get('window').width <= 768;

  const handleCreateSchedule = (newSchedule: any) => {
    const id = schedules.length + 1;
    setSchedules([...schedules, { ...newSchedule, id }]);
    setModalVisible(false);
  };
  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((shift) => shift.id !== id));
  };
  

  const filteredSchedules = schedules.filter((s) => {
    const matchEmployee = employeeFilter ? s.employee === employeeFilter : true;
    const matchLocation = locationFilter ? s.location === locationFilter : true;
    return matchEmployee && matchLocation;
  });

  const handleEditSchedule = (shift: any) => {
    setEditingShift(shift);
    setModalVisible(true);
  };

  const handleUpdateSchedule = (updatedShift: any) => {
    setSchedules((prev) =>
      prev.map((shift) => (shift.id === updatedShift.id ? updatedShift : shift))
    );
    setModalVisible(false);
    setEditingShift(null);
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedTab="Schedules"
        handleTabChange={() => setActiveTab('calendar')}
      />

      <View style={[styles.mainContent, { marginLeft: isMobile ? 0 : isSidebarOpen ? 250 : 0 }]}>        
        {/* Tabs */}
        <View style={styles.tabBar}>
          {['calendar', 'list', 'auto'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={styles.tabText}>
                {tab === 'calendar' ? 'Calendar View' : tab === 'list' ? 'List View' : 'Auto-Assign'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters
        <FilterControls
          employees={employees}
          locations={locations}
          employeeFilter={employeeFilter}
          locationFilter={locationFilter}
          setEmployeeFilter={setEmployeeFilter}
          setLocationFilter={setLocationFilter}
        /> */}

        {/* Content Views */}
        {activeTab === 'calendar' && (
          <GridCalendarView
            schedules={filteredSchedules}
            onCellPress={(emp, date) => {
              setSelectedEmployee(emp);
              setSelectedDate(date);
              setModalVisible(true);
            }}
            onShiftPress={(shift) => {
                setEditingShift(shift); // Pass the selected shift
                setModalVisible(true);
              }}
          />
        )}

        {/* List View */}
        {activeTab === 'list' && (
          <FlatList
            data={filteredSchedules}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.employee}</Text>
                <Text>{new Date(item.start).toLocaleString()} - {new Date(item.end).toLocaleString()}</Text>
                <Text>{item.location}</Text>
                <Text>{item.desc}</Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditSchedule(item)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSchedule(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {activeTab === 'auto' && (
          <View>
            <Text style={styles.autoAssignTitle}>Auto-Assign coming soon...</Text>
          </View>
        )}

<WebScheduleModal
  visible={modalVisible}
  onClose={() => {
    setModalVisible(false);
    setEditingShift(null);
  }}
  onSave={handleCreateSchedule}
  onDelete={() => {
    if (editingShift) {
      handleDeleteSchedule(editingShift.id);
      setEditingShift(null);
      setModalVisible(false);
    }
  }}
  employees={employees}
  locations={locations}
  selectedEmployee={selectedEmployee}
  selectedDate={selectedDate}
  editingShift={editingShift}
/>
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1, padding: 20, marginTop: 60 },
  tabBar: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tabButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  tabText: { fontSize: 16, fontWeight: '500' },
  listItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  bold: { fontWeight: 'bold', fontSize: 16 },
  autoAssignTitle: { fontSize: 18, fontWeight: 'bold', padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: {
    backgroundColor: '#4A90E2',
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: { color: '#fff' },
});
export default SchedulesScreen;