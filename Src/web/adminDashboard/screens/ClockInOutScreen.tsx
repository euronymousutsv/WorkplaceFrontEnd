import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const mockClockData = [
  {
    employee: 'Sabin',
    clockIn: '2025-03-28T09:00:00',
    clockOut: '2025-03-28T17:00:00',
    location: 'Melbourne',
    expected: 'Melbourne',
    lat: -37.8136,
    lng: 144.9631,
  },
  {
    employee: 'Pranish',
    clockIn: '2025-03-27T09:15:00',
    clockOut: '2025-03-27T17:10:00',
    location: 'Sydney',
    expected: 'Melbourne',
    lat: -33.8688,
    lng: 151.2093,
  },
  {
    employee: 'Aashish',
    clockIn: '2025-03-26T08:55:00',
    clockOut: '',
    location: 'Melbourne',
    expected: 'Melbourne',
    lat: -37.8136,
    lng: 144.9631,
  },
  {
    employee: 'Pranish',
    clockIn: new Date().toISOString(),
    clockOut: '',
    location: 'Melbourne',
    expected: 'Melbourne',
    lat: -37.8136,
    lng: 144.9631,
  },
];

const ClockInOutScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('ClockInOut');
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [dateError, setDateError] = useState('');

  const isMobile = screenWidth <= 768;
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(Dimensions.get('window').width);
    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => subscription.remove();
  }, []);

  const formatTime = (iso: string) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
  const formatDate = (iso: string) => iso ? new Date(iso).toISOString().slice(0, 10) : '—';

  const openMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url);
  };

  const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

  const handleDateChange = (text: string) => {
    setSearchDate(text);
    setDateError(isValidDate(text) || text === '' ? '' : 'Invalid format. Use YYYY-MM-DD');
  };

  const filteredData = mockClockData.filter(entry => {
    const matchesEmployee = entry.employee.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDate = searchDate && isValidDate(searchDate)
      ? new Date(entry.clockIn).toISOString().slice(0, 10) === searchDate
      : !searchDate;
    return matchesEmployee && matchesDate;
  });

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
        <Text style={styles.title}>Clock In/Out Records</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search employee..."
          value={searchEmployee}
          onChangeText={setSearchEmployee}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Filter by date (YYYY-MM-DD)"
          value={searchDate}
          onChangeText={handleDateChange}
        />
        {dateError !== '' && <Text style={styles.errorText}>{dateError}</Text>}

        <ScrollView horizontal={!isMobile}>
          <View style={[styles.table, isMobile && styles.mobileTable]}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Employee</Text>
              <Text style={styles.headerCell}>Clock In</Text>
              <Text style={styles.headerCell}>Clock Out</Text>
              <Text style={styles.headerCell}>Location</Text>
              <Text style={styles.headerCell}>Expected</Text>
              <Text style={styles.headerCell}>Status</Text>
              <Text style={styles.headerCell}>Map</Text>
            </View>

            {filteredData.map((entry, index) => {
              const verified = entry.location === entry.expected;
              const status = !entry.clockOut ? '🕒 Working' : verified ? '✅ Verified' : '❌ Wrong Place';
              const isToday = formatDate(entry.clockIn) === today;
              return (
                <View key={index} style={[styles.row, isToday && styles.todayRow]}>
                  <Text style={styles.cell}>{formatDate(entry.clockIn)}</Text>
                  <Text style={styles.cell}>{entry.employee}</Text>
                  <Text style={styles.cell}>{formatTime(entry.clockIn)}</Text>
                  <Text style={styles.cell}>{formatTime(entry.clockOut)}</Text>
                  <Text style={styles.cell}>{entry.location}</Text>
                  <Text style={styles.cell}>{entry.expected}</Text>
                  <Text style={[styles.cell, status.includes('❌') && styles.errorStatus]}>{status}</Text>
                  <TouchableOpacity onPress={() => openMap(entry.lat, entry.lng)}>
                    <Text style={[styles.cell, styles.mapLink]}>🗺️ View</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, padding: 20, marginTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#D9534F',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  table: { minWidth: 800 },
  mobileTable: { width: '100%' },
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
    borderColor: '#f0f0f0',
  },
  todayRow: {
    backgroundColor: '#e9f6ff',
  },
  headerCell: { flex: 1, fontWeight: 'bold', paddingHorizontal: 8 },
  cell: { flex: 1, paddingHorizontal: 8 },
  errorStatus: { color: '#D9534F', fontWeight: 'bold' },
  mapLink: { color: '#4A90E2', textDecorationLine: 'underline' },
});

export default ClockInOutScreen;