import React, { useState, useEffect } from 'react';
import { View, Modal, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (newSchedule: any) => void;
  employees: string[];
  locations: string[];
  selectedEmployee?: string;
  selectedDate?: string;
}

const CreateScheduleModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  employees,
  locations,
  selectedEmployee,
  selectedDate,
}) => {
  const [employee, setEmployee] = useState(selectedEmployee || '');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (visible) {
      setEmployee(selectedEmployee || '');
      setStart(selectedDate ? `${selectedDate}T09:00:00` : '');
      setEnd(selectedDate ? `${selectedDate}T17:00:00` : '');
      setLocation('');
      setDesc('');
    }
  }, [visible, selectedEmployee, selectedDate]);

  const handleSave = () => {
    if (employee && location && desc && start && end) {
      onSave({ employee, location, desc, start, end });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Schedule</Text>

          <TextInput
            style={styles.input}
            placeholder="Employee"
            value={employee}
            onChangeText={setEmployee}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
          />
          <TextInput
            style={styles.input}
            placeholder="Start Time (YYYY-MM-DDTHH:MM:SS)"
            value={start}
            onChangeText={setStart}
          />
          <TextInput
            style={styles.input}
            placeholder="End Time (YYYY-MM-DDTHH:MM:SS)"
            value={end}
            onChangeText={setEnd}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.button, styles.save]}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancel: {
    backgroundColor: '#ccc',
  },
  save: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default CreateScheduleModal;
