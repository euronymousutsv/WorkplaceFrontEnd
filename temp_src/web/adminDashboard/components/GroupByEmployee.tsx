// components/GroupByEmployee.tsx
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

const GroupByEmployee: React.FC<Props> = ({ schedules }) => {
  // Group schedules by employee name
  const grouped = schedules.reduce<Record<string, Schedule[]>>((acc, item) => {
    if (!acc[item.employee]) acc[item.employee] = [];
    acc[item.employee].push(item);
    return acc;
  }, {});

  const sortedEmployees = Object.keys(grouped).sort();

  return (
    <View>
      {sortedEmployees.map((emp) => (
        <View key={emp} style={styles.employeeGroup}>
          <Text style={styles.employeeName}>{emp}</Text>
          {grouped[emp]
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .map((shift) => (
              <View key={shift.id} style={styles.shiftCard}>
                <Text style={styles.detail}>
                  📅 {new Date(shift.start).toDateString()}
                </Text>
                <Text style={styles.detail}>
                  🕒 {new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(shift.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.detail}>📍 {shift.location}</Text>
                <Text style={styles.desc}>{shift.desc}</Text>
              </View>
            ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  employeeGroup: {
    marginBottom: 30,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  shiftCard: {
    backgroundColor: '#F2F6FC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  desc: {
    fontStyle: 'italic',
    color: '#777',
    marginTop: 4,
  },
});

export default GroupByEmployee;
