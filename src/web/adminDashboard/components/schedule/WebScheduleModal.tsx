import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { ShiftPayload } from "../../../../api/auth/shiftApi";
import dayjs from "dayjs";
interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ShiftPayload, isEditing?: boolean, shiftId?: string) => void;

  employees: { id: string; name: string }[];
  // locations: {id : string; name: string}[]; use this
  // locations: string[];
  officeId: string;
  selectedEmployee?: string;
  selectedDate?: string;
  editingShift?: any;
  onDelete?: () => void;
}

const WebScheduleModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  employees,
  selectedEmployee,
  officeId,
  selectedDate,
  editingShift,
  onDelete,
}) => {
  const [employee, setEmployee] = useState("");
  // const [officeId, setofficeId] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  
  useEffect(() => {
    if (visible) {
      if (editingShift) {
        const matched = employees.find(e => e.name === editingShift.employeeName);
        setEmployee(matched?.id || "");
        setDesc(editingShift.notes);
        const formattedStart = dayjs(editingShift.start).format("YYYY-MM-DDTHH:mm");
      const formattedEnd = dayjs(editingShift.end).format("YYYY-MM-DDTHH:mm");

      setStart(formattedStart);
      setEnd(formattedEnd);
      } else {
        setEmployee(selectedEmployee || "");
  
        if (selectedDate) {
          const base = new Date(selectedDate); // make sure this is a Date
          const year = base.getFullYear();
          const month = String(base.getMonth() + 1).padStart(2, "0");
          const day = String(base.getDate()).padStart(2, "0");
  
          setStart(`${year}-${month}-${day}T09:00`);
          setEnd(`${year}-${month}-${day}T17:00`);
        } else {
          setStart("");
          setEnd("");
        }
  
        setDesc("");
      }
  
      setErrors({});
    }
  }, [visible, selectedEmployee, selectedDate, editingShift]);
  
  const validate = () => {
    const err: any = {};
    if (!employee) err.employee = "Select employee";
    // if (!location) err.location = "Select location";
    if (!desc) err.desc = "Add description";
    if (!start || !end || new Date(start) >= new Date(end))
      err.time = "Start must be before end";
    setErrors(err);

    if (Object.keys(err).length > 0) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill out all fields correctly.",
      });
    }

    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
  
    // Use a simple regex to cut off extra time if needed
    const safeStart = start.trim().split("Z")[0];
    const safeEnd = end.trim().split("Z")[0];
  
    const parsedStart = new Date(safeStart);
    const parsedEnd = new Date(safeEnd);
  
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      Toast.show({
        type: "error",
        text1: "Invalid Date Format",
        text2: "Use format: YYYY-MM-DDTHH:mm (e.g. 2025-04-20T09:00)",
      });
      return;
    }
  
    const formattedStart = parsedStart.toISOString();
    const formattedEnd = parsedEnd.toISOString();
  
    onSave({
      employeeId: employee,
      officeId,
      startTime: formattedStart,
      endTime: formattedEnd,
      notes: desc,
      status: "pending",
      repeatFrequency: "weekly",
      repeatEndDate: "2025-06-20T00:00:00.000Z",
    }, !!editingShift, editingShift?.id);
  
    Toast.show({
      type: "success",
      text1: editingShift ? "Shift Updated" : "Schedule Created",
      text2: `${employee}'s shift has been ${editingShift ? "updated" : "scheduled"} successfully.`,
    });
  
    onClose();
  };


  const handleDelete = () => {
    onDelete?.();
    Toast.show({
      type: "info",
      text1: "Shift Deleted",
      text2: `${employee}'s shift was removed.`,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {editingShift ? "Edit Shift" : "Create Schedule"}
          </Text>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Employee</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={employee} onValueChange={setEmployee}>
                  <Picker.Item label="Select Employee" value="" />
                  {employees.map((e) => (
                    <Picker.Item key={e.id} label={e.name} value={e.id} />
                  ))}
                </Picker>
              </View>
              {errors.employee && (
                <Text style={styles.error}>{errors.employee}</Text>
              )}
            </View>

            {/* <View style={styles.field}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.pickerWrapper}>
               
              </View>
              {errors.location && (
                <Text style={styles.error}>{errors.location}</Text>
              )}
            </View> */}
          </View>

          <View style={styles.row}>
  <View style={styles.field}>
    <Text style={styles.label}>Start Time</Text>
    <input
      type="datetime-local"
      value={start}
      onChange={(e) => setStart(e.target.value)}
      style={{ ...styles.input, height: 40 }}
    />
  </View>
  <View style={styles.field}>
    <Text style={styles.label}>End Time</Text>
    <input
      type="datetime-local"
      value={end}
      onChange={(e) => setEnd(e.target.value)}
      style={{ ...styles.input, height: 40 }}
    />
  </View>
</View>

          {errors.time && <Text style={styles.error}>{errors.time}</Text>}

          <View>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              multiline
              value={desc}
              onChangeText={setDesc}
              placeholder="Shift description..."
            />
            {errors.desc && <Text style={styles.error}>{errors.desc}</Text>}
          </View>

          <View style={styles.actions}>
            {editingShift && (
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.btn, styles.delete]}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, styles.cancel]}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.btn, styles.save]}
            >
              <Text style={styles.btnText}>Save</Text>
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
    backgroundColor: "#00000088",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  row: { flexDirection: "row", gap: 20 },
  field: { flex: 1 },
  label: { fontWeight: "600", marginBottom: 4, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  error: { color: "#d9534f", fontSize: 12, marginTop: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  save: { backgroundColor: "#4A90E2" },
  cancel: { backgroundColor: "#888" },
  delete: { backgroundColor: "#d9534f" },
  btnText: { color: "#fff", fontWeight: "bold" },
});

export default WebScheduleModal;
