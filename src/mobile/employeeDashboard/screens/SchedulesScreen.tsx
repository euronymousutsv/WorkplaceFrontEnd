import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getShiftsByEmployee, Shifts } from '../../../api/auth/shiftApi'; // Import your fetch function
import ShiftCard from '../components/ShiftCard';
import { ApiError } from '../../../api/utils/apiResponse'; // Import for error handling
import { getUserIdFromToken } from "../../../utils/jwt";

const SchedulesScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [shifts, setShifts] = useState<Shifts[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
 

 
    const fetchShifts = async () => {
      setLoading(true);
      setRefreshing(false);
  
      const employeeId = await getUserIdFromToken(); 
      if (!employeeId) {
        setError("Employee ID not found in token");
        setLoading(false);
        setRefreshing(false);
        return;
      }
  
      const res = await getShiftsByEmployee(employeeId); 
  
      if (res instanceof ApiError) {
        console.log("Shift fetch error:", res.message);
        setError("Error fetching shifts");
      } else if ("statusCode" in res && "data" in res) {
        const mapped = res.data.map((shift: any) => ({
          id: shift.id,
          startTime: shift.startTime,
          endTime: shift.endTime,
          officeId: shift.officeId,
          notes: shift.notes ?? "",
  
          employeeId: shift.employeeId ?? employeeId,
          employeeName: shift.employeeName ?? "You",
          officeLocation: shift.officeLocation ?? {
            id: "",
            name: "",
            latitude: "",
            longitude: "",
            radius: 0,
            getCoordinates: () => "",
          },
        }));
  
        setShifts(mapped);
      
      } else {
        setError("Something went wrong");
      }
  
      setLoading(false);
      setRefreshing(false);
    };
  
  useEffect(() => {
    fetchShifts();
  }
  , []);
  

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

      <ScrollView style={styles.shiftsContainer} refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={fetchShifts} />
  }>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : shiftsForSelectedDate.length > 0 ? (
          shiftsForSelectedDate.map(shift => (
            <ShiftCard
                key={shift.id}
                shift={{
                  id: shift.id,
                  startTime: shift.startTime,
                  endTime: shift.endTime,
                  officeId: shift.officeId,
                  notes: shift.notes,
                  employeeId: "N/A",               // required by type, not UI
                  employeeName: "You",             // or fetch real name
                  officeLocation: {
                    id: "",
                    name: "",
                    latitude: "",
                    longitude: "",
                    radius: 0,
                    getCoordinates: () => "",
                  },
                }}
              />


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
