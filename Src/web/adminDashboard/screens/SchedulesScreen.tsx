import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchableDropdown from '../components/SearchableDropdown';
import GroupByDay from '../components/GroupByDay';
import GroupByEmployee from '../components/GroupByEmployee';
import CreateScheduleModal from '../components/CreateScheduleModal';

const allSchedules = [
  { id: 1, employee: 'Sabin', start: '2025-03-30T09:00:00', end: '2025-03-30T17:00:00', location: 'Melbourne', desc: 'Day shift' },
  { id: 2, employee: 'Pranish', start: '2025-03-30T10:00:00', end: '2025-03-30T18:00:00', location: 'Sydney', desc: 'Evening shift' },
  { id: 3, employee: 'Sabin', start: '2025-04-01T08:00:00', end: '2025-04-01T14:00:00', location: 'Geelong', desc: 'Morning shift' },
];

const employees = ['Sabin', 'Pranish', 'Aashish'];
const locations = ['Melbourne', 'Sydney', 'Brisbane', 'Geelong'];

const SchedulesScreen: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Schedules');
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [viewMode, setViewMode] = useState<'day' | 'employee'>('day');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [schedules, setSchedules] = useState(allSchedules); // local state to update shifts

  const isMobile = screenWidth <= 768;

  useEffect(() => {
    const updateWidth = () => setScreenWidth(Dimensions.get('window').width);
    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => subscription.remove();
  }, []);

  const filteredSchedules = schedules.filter((s) => {
    const matchEmployee = employeeFilter ? s.employee === employeeFilter : true;
    const matchLocation = locationFilter ? s.location === locationFilter : true;
    return matchEmployee && matchLocation;
  });

  const handleCreateSchedule = (newSchedule: any) => {
    const id = schedules.length + 1;
    setSchedules([...schedules, { ...newSchedule, id }]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedTab={selectedTab}
        handleTabChange={setSelectedTab}
      />

      <View style={[styles.mainContent, { marginLeft: isMobile ? 0 : isSidebarOpen ? 250 : 0 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Schedules</Text>
          <View style={styles.headerRight}>
            <View style={styles.viewToggle}>
              <TouchableOpacity onPress={() => setViewMode('day')}>
                <Text style={[styles.viewOption, viewMode === 'day' && styles.viewSelected]}>Day View</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setViewMode('employee')}>
                <Text style={[styles.viewOption, viewMode === 'employee' && styles.viewSelected]}>Employee View</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Create Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          <SearchableDropdown
            data={employees}
            placeholder="Filter by Employee"
            selected={employeeFilter}
            onSelect={setEmployeeFilter}
          />
          <SearchableDropdown
            data={locations}
            placeholder="Filter by Location"
            selected={locationFilter}
            onSelect={setLocationFilter}
          />
          <TouchableOpacity onPress={() => { setEmployeeFilter(''); setLocationFilter(''); }}>
            <Text style={styles.clearFilters}>Clear Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Schedule View */}
        <ScrollView>
          {viewMode === 'day' ? (
            <GroupByDay schedules={filteredSchedules} />
          ) : (
            <GroupByEmployee schedules={filteredSchedules} />
          )}
        </ScrollView>

        {/* Create Schedule Modal */}
        <CreateScheduleModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleCreateSchedule}
          employees={employees}
          locations={locations}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, padding: 20, marginTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewToggle: { flexDirection: 'row', gap: 12 },
  viewOption: { color: '#555', fontWeight: '500', padding: 6 },
  viewSelected: {
    backgroundColor: '#4A90E2',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  createButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  clearFilters: {
    color: '#D9534F',
    fontWeight: '600',
  },
});

export default SchedulesScreen;
