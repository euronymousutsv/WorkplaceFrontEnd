import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import SearchableDropdown from './SearchableDropdown';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  employees: string[];
  locations: string[];
}

const CreateScheduleModal: React.FC<Props> = ({ visible, onClose, onSave, employees, locations }) => {
  const [employee, setEmployee] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!employee) newErrors.employee = 'Employee is required';
    if (!location) newErrors.location = 'Location is required';
    if (endTime <= startTime) newErrors.time = 'End time must be after start time';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        employee,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        desc,
        location,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setEmployee('');
    setStartTime(new Date());
    setEndTime(new Date());
    setDesc('');
    setLocation('');
    setErrors({});
  };

  const formatDateTimeLocal = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DDTHH:mm');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Future Schedule</Text>

          <SearchableDropdown
            data={employees}
            placeholder="Select Employee"
            selected={employee}
            onSelect={setEmployee}
          />
          {errors.employee && <Text style={styles.errorText}>{errors.employee}</Text>}

          {/* Start Time */}
          {Platform.OS === 'web' ? (
            <input
              type="datetime-local"
              value={formatDateTimeLocal(startTime)}
              onChange={(e) => {
                const parsed = dayjs(e.target.value, 'YYYY-MM-DDTHH:mm');
                if (parsed.isValid()) setStartTime(parsed.toDate());
              }}
              style={styles.webInput}
            />
          ) : (
            <>
              <TouchableOpacity onPress={() => setShowStart(true)}>
                <Text style={styles.input}>Start: {startTime.toLocaleString()}</Text>
              </TouchableOpacity>
              {showStart && (
                <DateTimePicker
                  value={startTime}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(_, date) => {
                    setShowStart(false);
                    if (date) setStartTime(date);
                  }}
                />
              )}
            </>
          )}

          {/* End Time */}
          {Platform.OS === 'web' ? (
            <input
              type="datetime-local"
              value={formatDateTimeLocal(endTime)}
              onChange={(e) => {
                const parsed = dayjs(e.target.value, 'YYYY-MM-DDTHH:mm');
                if (parsed.isValid()) setEndTime(parsed.toDate());
              }}
              style={styles.webInput}
            />
          ) : (
            <>
              <TouchableOpacity onPress={() => setShowEnd(true)}>
                <Text style={styles.input}>End: {endTime.toLocaleString()}</Text>
              </TouchableOpacity>
              {showEnd && (
                <DateTimePicker
                  value={endTime}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(_, date) => {
                    setShowEnd(false);
                    if (date) setEndTime(date);
                  }}
                />
              )}
            </>
          )}
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}

          <TextInput
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
            style={styles.input}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={location}
              onValueChange={(value) => setLocation(value)}
              style={Platform.OS === 'android' ? styles.pickerAndroid : undefined}
            >
              <Picker.Item label="Select Location" value="" />
              {locations.map((loc) => (
                <Picker.Item key={loc} label={loc} value={loc} />
              ))}
            </Picker>
          </View>
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={handleSubmit}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  webInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  pickerAndroid: {
    height: 45,
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancel: {
    backgroundColor: '#888',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  save: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  errorText: {
    color: '#D9534F',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 6,
  },
});

export default CreateScheduleModal;
