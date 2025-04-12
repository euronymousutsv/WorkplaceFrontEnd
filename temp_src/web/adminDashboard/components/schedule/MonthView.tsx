import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Schedule {
  id: number;
  employee: string;
  start: string;
  end: string;
  location: string;
  desc: string;
}

interface MonthViewProps {
  currentDate: Date;
  schedules: Schedule[];
  onCellPress: (employee: string, date: string) => void;
  onShiftPress: (shift: Schedule) => void;
}

const employeeColors: { [name: string]: string } = {
  Sabin: '#4A90E2',
  Pranish: '#2ECC71',
  Aashish: '#E67E22',
};

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  schedules,
  onCellPress,
  onShiftPress,
}) => {
  const getStartOfMonth = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const offset = start.getDay(); // Sunday = 0
    start.setDate(start.getDate() - offset);
    return start;
  };

  const getDaysInMonthGrid = () => {
    const start = getStartOfMonth(currentDate);
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getShiftsForDay = (date: Date) => {
    return schedules.filter((shift) => {
      const shiftDate = new Date(shift.start).toDateString();
      return new Date(date).toDateString() === shiftDate;
    });
  };

  const days = getDaysInMonthGrid();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <Text key={d} style={styles.weekdayHeader}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const dayStr = day.getDate().toString();
          const shiftItems = getShiftsForDay(day);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.cell, !isCurrentMonth && styles.outsideMonth]}
              onPress={() => onCellPress('', day.toISOString().split('T')[0])}
            >
              <Text style={styles.dayNumber}>{dayStr}</Text>
              {shiftItems.map((shift) => (
                <TouchableOpacity
                  key={shift.id}
                  onPress={() => onShiftPress(shift)}
                  style={[styles.shiftBlock, { backgroundColor: employeeColors[shift.employee] || '#888' }]}
                >
                  <Text style={styles.shiftText}>{shift.employee}</Text>
                  <Text style={styles.shiftText}>{shift.start.split('T')[1].slice(0, 5)}</Text>
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  weekdayHeader: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    borderWidth: 0.5,
    borderColor: '#ccc',
    padding: 4,
    minHeight: 80,
  },
  outsideMonth: {
    backgroundColor: '#f9f9f9',
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  shiftBlock: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  shiftText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
});

export default MonthView;
