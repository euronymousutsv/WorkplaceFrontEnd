import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { mockIncome } from '../data/mockIncome';
import { Ionicons } from '@expo/vector-icons';

const IncomeScreen: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (period: string) => {
    setExpandedCard(expandedCard === period ? null : period);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {mockIncome.length > 0 ? (
          mockIncome.map((item) => (
            <View key={item.period} style={styles.incomeCard}>
              <TouchableOpacity onPress={() => toggleExpand(item.period)} style={styles.cardHeader}>
                <Text style={styles.periodText}>{item.period}</Text>
                <Ionicons name={expandedCard === item.period ? "chevron-up" : "chevron-down"} size={24} color="#4A90E2" />
              </TouchableOpacity>

              <Text style={styles.summaryText}>Total Hours: {item.totalHours.toFixed(2)} hrs</Text>
              <Text style={styles.summaryText}>Total Earnings: ${item.totalEarnings.toFixed(2)}</Text>

              {expandedCard === item.period && (
                <View style={styles.detailsContainer}>
                  {item.shifts.map((shift: any) => (
                    <View key={shift.id} style={styles.shiftDetails}>
                      <Text style={styles.detailText}>{shift.date}</Text>
                      <Text style={styles.detailText}>Hours: {shift.hoursWorked} hrs</Text>
                      <Text style={styles.detailText}>Earnings: ${shift.earnings.toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noIncomeText}>No income records available.</Text>
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
  incomeCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  summaryText: {
    fontSize: 14,
    color: '#393D3F',
    marginTop: 5,
  },
  detailsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  shiftDetails: {
    backgroundColor: '#F7F7F7',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#393D3F',
  },
  noIncomeText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8E9196',
    marginTop: 20,
  },
});

export default IncomeScreen;
