import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

interface Schedule {
  id: number;
  employee: string;
  start: string;
  end: string;
  location: string;
  desc: string;
}

interface WeekViewProps {
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

const WeekView: React.FC<WeekViewProps> = ({ currentDate, schedules, onCellPress, onShiftPress }) => {
  const scrollRef = useRef<FlatList<any>>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const days = getWeekDays();

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

  const getShiftsForCell = (date: Date, hour: number) => {
    const cellStart = new Date(date);
    cellStart.setHours(hour, 0, 0, 0);
    const cellEnd = new Date(cellStart);
    cellEnd.setHours(hour + 1);

    return schedules.filter((shift) => {
      const shiftStart = new Date(shift.start);
      const shiftEnd = new Date(shift.end);
      return shiftStart < cellEnd && shiftEnd > cellStart;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.timeColumn}><Text style={styles.timeText}>Time</Text></View>
        {days.map((day, idx) => (
          <View style={styles.columnHeader} key={idx}>
            <Text style={styles.columnHeaderText}>
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Text style={styles.columnDate}>
              {day.getMonth() + 1}/{day.getDate()}
            </Text>
          </View>
        ))}
      </View>

      <FlatList
        ref={scrollRef}
        data={hours}
        
        style={{ flexGrow: 1, height:144 }}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item: hour }) => (
          <View style={styles.row}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{formatHour(hour)}</Text>
            </View>
            {days.map((date, dayIdx) => (
              <TouchableOpacity
                key={dayIdx}
                style={styles.cell}
                onPress={() => onCellPress('', date.toISOString().split('T')[0])}
              >
                {getShiftsForCell(date, hour)
  .filter((shift) => {
    const shiftStart = new Date(shift.start);
    return shiftStart.getHours() === hour; // Only render in start hour
  })
  .map((shift) => {
    const shiftStart = new Date(shift.start);
    const shiftEnd = new Date(shift.end);
    const overlapStart = Math.max(shiftStart.getTime(), new Date(date.setHours(hour, 0, 0, 0)).getTime());
    const overlapEnd = Math.min(shiftEnd.getTime(), new Date(date.setHours(hour + 1, 0, 0, 0)).getTime());
    const duration = (shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60); // minutes
    const topOffset = (Math.max(0, (overlapStart - new Date(date.setHours(hour, 0, 0, 0)).getTime())) / (1000 * 60)) * 60;

    return (
      <TouchableOpacity
        key={shift.id}
        onPress={() => onShiftPress(shift)}
        style={[styles.shiftBlock, {
          backgroundColor: employeeColors[shift.employee] || '#888',
          top: topOffset,
          height: (duration / 60) * 60,
          position: 'absolute',
          left: 2,
          right: 2,
        }]}
      >
        <Text style={styles.shiftText}>{shift.employee}</Text>
        <Text style={styles.shiftText}>
          {shift.start.split('T')[1].slice(0, 5)} - {shift.end.split('T')[1].slice(0, 5)}
        </Text>
      </TouchableOpacity>
    );
  })}
              </TouchableOpacity>
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1 },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    padding: 4,
  },
  columnHeader: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  columnHeaderText: { fontWeight: 'bold', fontSize: 12, color: '#333' },
  columnDate: { fontWeight: '600', color: '#4A90E2' },
  timeText: { fontSize: 12, color: '#666' },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    minHeight: 60,
  },
  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#eee',
    position: 'relative',
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

export default WeekView;
