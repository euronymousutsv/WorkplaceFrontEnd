import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface Schedule {
  id: number;
  employee: string;
  start: string;
  end: string;
  location: string;
  desc: string;
}

interface DayViewProps {
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

const DayView: React.FC<DayViewProps> = ({ currentDate, schedules, onCellPress, onShiftPress }) => {
  const scrollRef = useRef<FlatList<any>>(null);
  const [conflictShifts, setConflictShifts] = useState<Schedule[]>([]);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    const hour = new Date().getHours();
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: hour * 60, animated: true });
    }
  }, []);

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  // Function to detect shift conflicts
  const isConflicting = (shift1: Schedule, shift2: Schedule) => {
    const shift1Start = new Date(shift1.start).getTime();
    const shift1End = new Date(shift1.end).getTime();
    const shift2Start = new Date(shift2.start).getTime();
    const shift2End = new Date(shift2.end).getTime();

    return (
      (shift1Start < shift2End && shift1End > shift2Start) ||
      (shift2Start < shift1End && shift2End > shift1Start)
    );
  };

  // Function to find conflicting shifts for a new shift
  const findConflicts = (newShift: Schedule) => {
    const conflicts: Schedule[] = [];
    schedules.forEach((shift) => {
      if (isConflicting(newShift, shift)) {
        conflicts.push(shift);
      }
    });
    return conflicts;
  };

  // Update conflict shifts whenever schedules change
  useEffect(() => {
    setConflictShifts([]);
    schedules.forEach((shift) => {
      const conflicts = findConflicts(shift);
      if (conflicts.length > 0) {
        setConflictShifts((prevConflicts) => [...prevConflicts, ...conflicts]);
      }
    });
  }, [schedules]);

  const getShiftsForHour = (hour: number) => {
    const cellStart = new Date(currentDate);
    cellStart.setHours(hour, 0, 0, 0);
    const cellEnd = new Date(cellStart);
    cellEnd.setHours(hour + 1, 0, 0, 0);

    return schedules.filter((shift) => {
      const shiftStart = new Date(shift.start);
      return shiftStart >= cellStart && shiftStart < cellEnd;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateTitle}>
          {currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>

      <FlatList
        ref={scrollRef}
        data={hours}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flexGrow: 1, height: 144 }}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item: hour }) => {
          const shiftsInThisHour = getShiftsForHour(hour);

          return (
            <View style={styles.row}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{formatHour(hour)}</Text>
              </View>

              <TouchableOpacity
                style={styles.cell}
                onPress={() => onCellPress('', currentDate.toISOString().split('T')[0])}
              >
                {shiftsInThisHour.map((shift) => {
                  const shiftStart = new Date(shift.start);
                  const shiftEnd = new Date(shift.end);
                  const durationMinutes = (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60); // in minutes
                  const offsetTop = shiftStart.getMinutes(); // from the top of the hour

                  // Check for conflicts
                  const isConflict = conflictShifts.some((conflictShift) => conflictShift.id === shift.id);

                  return (
                    <TouchableOpacity
                      key={shift.id}
                      onPress={() => onShiftPress(shift)}
                      style={[
                        styles.shiftBlock,
                        {
                          backgroundColor: isConflict ? '#d9534f' : employeeColors[shift.employee] || '#888',
                          top: (offsetTop / 60) * 60,
                          height: (durationMinutes / 60) * 60,
                          position: 'absolute',
                          left: 2,
                          right: 2,
                        },
                      ]}
                    >
                      <Text style={styles.shiftText}>{shift.employee}</Text>
                      <Text style={styles.shiftText}>
                        {shift.start.split('T')[1].slice(0, 5)} - {shift.end.split('T')[1].slice(0, 5)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    minHeight: 60,
    backgroundColor: '#fff',
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  cell: {
    flex: 1,
    position: 'relative',
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  shiftBlock: {
    backgroundColor: '#4A90E2',
    padding: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  shiftText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default DayView;
