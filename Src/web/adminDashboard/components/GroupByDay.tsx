// components/GroupByDay.tsx
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

const GroupByDay: React.FC<Props> = ({ schedules }) => {
  // Group schedules by date
  const grouped = schedules.reduce<Record<string, Schedule[]>>((acc, item) => {
    const date = new Date(item.start).toDateString(); // Ex: "Sun Mar 30 2025"
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <View>
      {sortedDates.map((date) => (
        <View key={date} style={styles.dayGroup}>
          <Text style={styles.dateTitle}>{date}</Text>
          {grouped[date].map((shift) => (
            <View key={shift.id} style={styles.shiftCard}>
              <Text style={styles.employee}>{shift.employee}</Text>
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
  dayGroup: {
    marginBottom: 30,
  },
  dateTitle: {
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
  employee: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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

export default GroupByDay;
