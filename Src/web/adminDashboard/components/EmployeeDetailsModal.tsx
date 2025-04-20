import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchEmployeeDetails } from '../../../api/server/serverApi';
import Toast from 'react-native-toast-message';

interface EmployeeDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  employeeId: string | null;
}

interface EmployeeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  employmentStatus: string | { [key: string]: string };
  profileImage?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  isVisible,
  onClose,
  employeeId,
}) => {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) return;
      
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching employee details for ID:', employeeId);
        const response = await fetchEmployeeDetails(employeeId);
        console.log('API Response:', response);
        
        if (response instanceof Error) {
          console.error('API Error:', response);
          setError(response.message || 'Failed to fetch employee details');
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: response.message || 'Failed to fetch employee details',
          });
          return;
        }

        // Check if response has the expected structure
        if (!response.data) {
          console.error('Invalid response structure:', response);
          setError('Invalid response from server');
          return;
        }

        const employeeData: EmployeeData = {
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          role: response.data.role,
          employmentStatus: response.data.employmentStatus,
          profileImage: response.data.profileImage,
        };

        setEmployee(employeeData);
      } catch (error) {
        console.error('Error in fetchEmployee:', error);
        setError('An unexpected error occurred');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An unexpected error occurred',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isVisible && employeeId) {
      fetchEmployee();
    } else {
      setEmployee(null);
      setError(null);
    }
  }, [isVisible, employeeId]);

  if (!employeeId) return null;

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const getRoleBadgeStyle = (role: string) => {
    switch (role.trim().toLowerCase()) {
      case 'admin':
        return styles.adminBadge;
      case 'manager':
        return styles.managerBadge;
      case 'employee':
        return styles.employeeBadge;
      default:
        return { backgroundColor: '#999' };
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading employee details...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!employee) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No employee data available</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          {employee.profileImage ? (
            <Image
              source={{ uri: employee.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.initialsCircle}>
              <Text style={styles.initialsText}>
                {getInitials(employee.firstName, employee.lastName)}
              </Text>
            </View>
          )}
          <Text style={styles.employeeName}>
            {employee.firstName} {employee.lastName}
          </Text>
          <Text style={[styles.roleBadge, getRoleBadgeStyle(employee.role)]}>
            {employee.role}
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <DetailRow label="Employee ID" value={employee.id} />
          <DetailRow label="Email" value={employee.email} />
          <DetailRow label="Phone" value={employee.phoneNumber} />
          <DetailRow 
            label="Status" 
            value={typeof employee.employmentStatus === 'string' 
              ? employee.employmentStatus 
              : Object.keys(employee.employmentStatus)[0]} 
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Employee Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  initialsCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  initialsText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  employeeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    overflow: 'hidden',
    fontSize: 14,
  },
  adminBadge: { backgroundColor: '#8e44ad' },
  managerBadge: { backgroundColor: '#27ae60' },
  employeeBadge: { backgroundColor: '#2980b9' },
  detailsSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    color: '#666',
    fontSize: 16,
  },
  detailValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
});

export default EmployeeDetailsModal; 