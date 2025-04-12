// import React from 'react';
// import { View, Text, StyleSheet, Picker, TouchableOpacity } from 'react-native';

// interface Props {
//   employees: string[];
//   locations: string[];
//   employeeFilter: string;
//   locationFilter: string;
//   setEmployeeFilter: (val: string) => void;
//   setLocationFilter: (val: string) => void;
// }

// const FilterControls: React.FC<Props> = ({
//   employees,
//   locations,
//   employeeFilter,
//   locationFilter,
//   setEmployeeFilter,
//   setLocationFilter,
// }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.filterGroup}>
//         <Text style={styles.label}>Employee:</Text>
//         <Picker
//           selectedValue={employeeFilter}
//           style={styles.picker}
//           onValueChange={(val) => setEmployeeFilter(val)}
//         >
//           <Picker.Item label="All" value="" />
//           {employees.map((emp) => (
//             <Picker.Item label={emp} value={emp} key={emp} />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.filterGroup}>
//         <Text style={styles.label}>Location:</Text>
//         <Picker
//           selectedValue={locationFilter}
//           style={styles.picker}
//           onValueChange={(val) => setLocationFilter(val)}
//         >
//           <Picker.Item label="All" value="" />
//           {locations.map((loc) => (
//             <Picker.Item label={loc} value={loc} key={loc} />
//           ))}
//         </Picker>
//       </View>

//       <TouchableOpacity
//         style={styles.clearBtn}
//         onPress={() => {
//           setEmployeeFilter('');
//           setLocationFilter('');
//         }}
//       >
//         <Text style={styles.clearText}>Clear Filters</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default FilterControls;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     gap: 16,
//     flexWrap: 'wrap',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   filterGroup: {
//     flexDirection: 'column',
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   picker: {
//     height: 40,
//     width: 150,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   clearBtn: {
//     backgroundColor: '#D9534F',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 4,
//   },
//   clearText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });
