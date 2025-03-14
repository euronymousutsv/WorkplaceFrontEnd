import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { mockShifts } from '../../../mockData/mockShifts';
import ShiftCard from '../components/ShiftCard';

const SchedulesScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const markedDates = mockShifts.reduce((dates, shift) => {
    const date = shift.startTime.toISOString().split('T')[0];
    dates[date] = { marked: true, dotColor: '#4A90E2' };
    return dates;
  }, {} as Record<string, any>);

  const shiftsForSelectedDate = mockShifts.filter(
    shift => shift.startTime.toISOString().split('T')[0] === selectedDate
  );

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: '#4A90E2' },
        }}
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayTextColor: '#fff',
          todayTextColor: '#2ECC71',
        }}
      />

      <Text style={styles.selectedDateTitle}>
        Shifts for {new Date(selectedDate).toDateString()}
      </Text>

      <ScrollView style={styles.shiftsContainer}>
        {shiftsForSelectedDate.length > 0 ? (
          shiftsForSelectedDate.map(shift => (
            <ShiftCard key={shift.id} shift={shift} />
          ))
        ) : (
          <Text style={styles.noShiftsText}>No shifts for selected date.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFF',
    padding: 10,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#393D3F',
    marginVertical: 12,
    textAlign: 'center',
  },
  shiftsContainer: {
    flex: 1,
    marginTop: 10,
  },
  noShiftsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8E9196',
    marginTop: 20,
  },
});

export default SchedulesScreen;
