// components/ScheduleTable.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Schedule {
  id: number;
  employee: string;
  start: string;
  end: string;
  location: string;
  desc: string;
}

interface Props {
  schedules: Schedule[];
}

const ScheduleTable: React.FC<Props> = ({ schedules }) => {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Employee</Text>
        <Text style={styles.headerCell}>Start</Text>
        <Text style={styles.headerCell}>End</Text>
        <Text style={styles.headerCell}>Location</Text>
        <Text style={styles.headerCell}>Description</Text>
      </View>

      {schedules.map((schedule) => (
        <View key={schedule.id} style={styles.dataRow}>
          <Text style={styles.cell}>{schedule.employee}</Text>
          <Text style={styles.cell}>{schedule.start}</Text>
          <Text style={styles.cell}>{schedule.end}</Text>
          <Text style={styles.cell}>{schedule.location}</Text>
          <Text style={styles.cell}>{schedule.desc}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: { minWidth: 600 },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

export default ScheduleTable;
