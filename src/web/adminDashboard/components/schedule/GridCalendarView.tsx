// GridCalendarView.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

interface Schedule {
  id: number;
  employee: string;
  start: string;
  end: string;
  location: string;
  desc: string;
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
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [dateCursor, setDateCursor] = useState(new Date());
  const [editingShift, setEditingShift] = useState<any | null>(null);


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
          <TouchableOpacity onPress={handlePrev}><Text style={styles.navButton}>{'<'}</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleToday}><Text style={styles.navButton}>Today</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleNext}><Text style={styles.navButton}>{'>'}</Text></TouchableOpacity>
        </View>

        <View style={styles.rightNav}>
          {['month', 'week', 'day'].map((mode) => (
            <TouchableOpacity key={mode} onPress={() => setViewMode(mode as any)}>
              <Text
                style={[
                  styles.viewToggle,
                  viewMode === mode && styles.activeToggle,
                ]}
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

      {/* Calendar View */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        {viewMode === 'month' && (
          <MonthView
            currentDate={dateCursor}
            schedules={schedules}
            onCellPress={onCellPress}
            onShiftPress={onShiftPress}
          />
        )}
        {viewMode === 'week' && (
          <WeekView
            currentDate={dateCursor}
            schedules={schedules}
            onCellPress={onCellPress}
            onShiftPress={onShiftPress}
          />
        )}
        {viewMode === 'day' && (
          <DayView
            currentDate={dateCursor}
            schedules={schedules}
            onCellPress={onCellPress}
            onShiftPress={onShiftPress}
          />
        )}
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
  rightNav: {
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
