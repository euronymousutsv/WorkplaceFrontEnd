import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getShiftsForLoggedInUser } from '../../../api/auth/shiftApi'; // Import your fetch function
import ShiftCard from '../components/ShiftCard';
import { ApiError } from '../../../api/utils/apiResponse'; // Import for error handling

const SchedulesScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [shifts, setShifts] = useState<any[]>([]); // To store shifts from the backend
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch shifts when the component mounts
  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      const res = await getShiftsForLoggedInUser();
      if (res instanceof ApiError) {
        console.log(res.message);
        setError('Error fetching shifts');
      } else if ('statusCode' in res && 'data' in res) {
        setShifts(res.data); // Set the fetched shifts
      } else {
        setError('Something went wrong');
      }
      setLoading(false);
    };

    fetchShifts();
  }, []);

  // Mark dates with shifts
  const markedDates = shifts.reduce((dates, shift) => {
    const date = new Date(shift.startTime).toISOString().split('T')[0];
    dates[date] = { marked: true, dotColor: '#4A90E2' };
    return dates;
  }, {} as Record<string, any>);

  // Filter shifts for the selected date
  const shiftsForSelectedDate = shifts.filter(
    shift => new Date(shift.startTime).toISOString().split('T')[0] === selectedDate
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
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : shiftsForSelectedDate.length > 0 ? (
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SchedulesScreen;
