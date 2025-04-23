// GridCalendarView.tsx
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-big-calendar';

interface Schedule {
  id: number;
  employeeId: string;
  employeeName: string;
  start: string;
  end: string;
  notes?: string;
}

interface GridCalendarViewProps {
  schedules: Schedule[];
  onCellPress: (employee: string, date: string) => void;
  onShiftPress: (shift: Schedule) => void;
}

const GridCalendarView: React.FC<GridCalendarViewProps> = ({
  schedules,
  onCellPress,
  onShiftPress,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [dateCursor, setDateCursor] = useState(new Date());

  const mappedEvents = schedules.map((shift) => ({
    title: `${shift.employeeName}: ${shift.notes || "No notes"}`,

    start: new Date(shift.start),
    end: new Date(shift.end),
    color: '#4A90E2',
    id: shift.id.toString(),
  }));

  const handleEventPress = (event: any) => {
    const selectedShift = schedules.find((s) => s.id.toString() === event.id);
    if (selectedShift) onShiftPress(selectedShift);
    else Alert.alert('Shift not found');
  };

  const handleCellPress = (date: Date) => {
    // Always allow cell press to open modal in any view
    onCellPress('', date.toISOString());
  };

  const handlePrev = () => {
    const newDate = new Date(dateCursor);
    if (viewMode === 'month') newDate.setMonth(dateCursor.getMonth() - 1);
    else newDate.setDate(dateCursor.getDate() - (viewMode === 'week' ? 7 : 1));
    setDateCursor(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(dateCursor);
    if (viewMode === 'month') newDate.setMonth(dateCursor.getMonth() + 1);
    else newDate.setDate(dateCursor.getDate() + (viewMode === 'week' ? 7 : 1));
    setDateCursor(newDate);
  };

  const handleToday = () => setDateCursor(new Date());

  const getDateHeaderText = () => {
    if (viewMode === 'month') {
      return dateCursor.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } else if (viewMode === 'week') {
      const start = new Date(dateCursor);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
    } else {
      return dateCursor.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.leftNav}>
          <TouchableOpacity onPress={handlePrev}><Feather name="chevron-left" size={18} color="#4A90E2" /></TouchableOpacity>
          <TouchableOpacity onPress={handleToday}><Text style={styles.navButton}>Today</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleNext}><Feather name="chevron-right" size={18} color="#4A90E2" /></TouchableOpacity>
        </View>

        <View style={styles.viewGroup}>
          {['month', 'week', 'day'].map((mode) => (
            <TouchableOpacity key={mode} onPress={() => setViewMode(mode as any)}>
              <Text
                style={[styles.viewToggle, viewMode === mode && styles.activeToggle]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dynamic Date Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{getDateHeaderText()}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Calendar
          events={mappedEvents}
          height={800}
          mode={viewMode}
          onPressEvent={handleEventPress}
          onPressCell={handleCellPress}
          swipeEnabled={false}
          weekStartsOn={1}
          showTime={true}
          date={dateCursor}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  leftNav: {
    flexDirection: 'row',
    gap: 10,
  },
  viewGroup: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 6,
    overflow: 'hidden',
  },
  navButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 8,
    paddingVertical: 4,
  },
  viewToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#333',
  },
  activeToggle: {
    backgroundColor: '#4A90E2',
    color: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GridCalendarView;
