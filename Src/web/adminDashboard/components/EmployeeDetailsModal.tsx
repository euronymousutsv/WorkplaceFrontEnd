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
  TextInput,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchEmployeeDetails, updateEmployeeInfo, fetchEmployeeDocuments } from '../../../api/server/serverApi';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';

interface Document {
  id: string;
  employeeId: string;
  documentType: 'License' | 'National ID';
  documentid: string;
  expiryDate: string;
  issueDate: string;
  docsURL: string;
  isVerified: boolean;
}

interface EmployeeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  employmentStatus: string;
  profileImage?: string;
  detailsEmployee: {
    id: string;
    employeeId: string;
    username: string;
    baseRate: string;
    contractHours: string;
    employeeType: string;
    department: string;
    position: string;
    hireDate: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  documents?: Document[];
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface EmployeeDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  employeeId: string | null;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  isVisible,
  onClose,
  employeeId,
}) => {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId) return;
      
      setLoading(true);
      setError(null);
      setDocumentsLoading(true);
      setDocumentsError(null);

      try {
        // Fetch employee details
        const employeeResponse = await fetchEmployeeDetails(employeeId);
        
        if (employeeResponse instanceof Error) {
          setError(employeeResponse.message || 'Failed to fetch employee details');
          return;
        }

        if (!employeeResponse.data) {
          setError('Invalid response from server');
          return;
        }

        const employeeData = employeeResponse.data as EmployeeData;
        setEmployee(employeeData);
        setEditedEmployee(employeeData);

        // Fetch documents
        const documentsResponse = await fetchEmployeeDocuments(employeeId);
        
        if (documentsResponse instanceof Error) {
          setDocumentsError(documentsResponse.message || 'Failed to fetch documents');
          return;
        }

        if (documentsResponse.data) {
          setDocuments([documentsResponse.data]);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
        setDocumentsLoading(false);
      }
    };

    if (isVisible && employeeId) {
      fetchData();
    } else {
      setEmployee(null);
      setEditedEmployee(null);
      setError(null);
      setIsEditing(false);
      setDocuments([]);
      setDocumentsError(null);
    }
  }, [isVisible, employeeId]);

  const handleInputChange = (field: string, value: string) => {
    if (!editedEmployee) return;

    if (field.includes('.')) {
      // Handle nested fields (detailsEmployee)
      const [parent, child] = field.split('.');
      setEditedEmployee(prev => {
        if (!prev) return prev;
        if (parent === 'detailsEmployee') {
          return {
            ...prev,
            detailsEmployee: {
              ...prev.detailsEmployee,
              [child]: value,
            },
          };
        }
        return prev;
      });
    } else {
      // Handle top-level fields
      setEditedEmployee(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value,
        };
      });
    }
  };

  const handleSave = async () => {
    if (!editedEmployee) return;

    setIsSaving(true);
    try {
      const updateData = {
        employeeId: editedEmployee.id,
        username: editedEmployee.detailsEmployee.username,
        baseRate: editedEmployee.detailsEmployee.baseRate,
        contractHours: editedEmployee.detailsEmployee.contractHours,
        employeeType: editedEmployee.detailsEmployee.employeeType,
        department: editedEmployee.detailsEmployee.department,
        position: editedEmployee.detailsEmployee.position,
        hireDate: editedEmployee.detailsEmployee.hireDate,
      };

      const response = await updateEmployeeInfo(updateData);

      if (response instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to update employee details',
        });
        return;
      }

      setEmployee(editedEmployee);
      setIsEditing(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Employee details updated successfully',
      });
    } catch (error) {
      console.error('Error saving employee details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update employee details',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      // TODO: Implement document verification API call
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Document verified successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to verify document',
      });
    }
  };

  const handleViewDocument = (url: string) => {
    Linking.openURL(url).catch(err => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not open document',
      });
    });
  };

  const renderField = (
    label: string, 
    field: string, 
    value: string, 
    type: 'text' | 'number' | 'select' = 'text', 
    options?: string[],
    isReadOnly: boolean = false
  ) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing && !isReadOnly ? (
          type === 'select' ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => handleInputChange(field, itemValue)}
                style={styles.picker}
              >
                {options?.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => handleInputChange(field, text)}
              keyboardType={type === 'number' ? 'numeric' : 'default'}
            />
          )
        ) : (
          <Text style={styles.fieldValue}>{value}</Text>
        )}
      </View>
    );
  };

  const renderDocumentSection = () => {
    if (documentsLoading) {
      return (
        <View style={styles.documentSection}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading documents...</Text>
          </View>
        </View>
      );
    }

    if (documentsError) {
      return (
        <View style={styles.documentSection}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={24} color="#ff6b6b" />
            <Text style={styles.errorText}>{documentsError}</Text>
          </View>
        </View>
      );
    }

    if (!documents || documents.length === 0) {
      return (
        <View style={styles.documentSection}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <Text style={styles.noDocumentsText}>No documents available</Text>
        </View>
      );
    }

    return (
      <View style={styles.documentSection}>
        <Text style={styles.sectionTitle}>Documents</Text>
        {documents.map((doc) => (
          <View key={doc.id} style={styles.documentCard}>
            <View style={styles.documentHeader}>
              <Text style={styles.documentType}>{doc.documentType}</Text>
              <View style={styles.documentStatus}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: doc.isVerified ? '#4CAF50' : '#FFC107' }
                ]} />
                <Text style={styles.statusText}>
                  {doc.isVerified ? 'Verified' : 'Pending Verification'}
                </Text>
              </View>
            </View>
            
            <View style={styles.documentInfo}>
              <Text style={styles.documentLabel}>Document ID:</Text>
              <Text style={styles.documentValue}>{doc.documentid}</Text>
            </View>
            
            <View style={styles.documentInfo}>
              <Text style={styles.documentLabel}>Issue Date:</Text>
              <Text style={styles.documentValue}>
                {new Date(doc.issueDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.documentInfo}>
              <Text style={styles.documentLabel}>Expiry Date:</Text>
              <Text style={[
                styles.documentValue,
                new Date(doc.expiryDate) < new Date() && styles.expiredText
              ]}>
                {new Date(doc.expiryDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.documentActions}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewDocument(doc.docsURL)}
              >
                <MaterialIcons name="visibility" size={20} color="#4A90E2" />
                <Text style={styles.viewButtonText}>View Document</Text>
              </TouchableOpacity>

              {!doc.isVerified && (
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => handleVerifyDocument(doc.id)}
                >
                  <MaterialIcons name="verified" size={20} color="#4CAF50" />
                  <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    );
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

    if (!editedEmployee) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No employee data available</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          {editedEmployee.profileImage ? (
            <Image
              source={{ uri: editedEmployee.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.initialsCircle}>
              <Text style={styles.initialsText}>
                {`${editedEmployee.firstName.charAt(0)}${editedEmployee.lastName.charAt(0)}`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          {renderField('Employee ID', 'id', editedEmployee.id, 'text', undefined, true)}
          {renderField('First Name', 'firstName', editedEmployee.firstName, 'text', undefined, true)}
          {renderField('Last Name', 'lastName', editedEmployee.lastName, 'text', undefined, true)}
          {renderField('Email', 'email', editedEmployee.email, 'text', undefined, true)}
          {renderField('Phone', 'phoneNumber', editedEmployee.phoneNumber, 'text', undefined, true)}
          {renderField('Role', 'role', editedEmployee.role, 'text', undefined, true)}
          {renderField('Employment Status', 'employmentStatus', editedEmployee.employmentStatus, 'text', undefined, true)}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Employment Details</Text>
          {!isSaving ? (
            <>
              {renderField('Username', 'detailsEmployee.username', editedEmployee.detailsEmployee.username)}
              {renderField('Base Rate', 'detailsEmployee.baseRate', editedEmployee.detailsEmployee.baseRate, 'number')}
              {renderField('Contract Hours', 'detailsEmployee.contractHours', editedEmployee.detailsEmployee.contractHours, 'number')}
              {renderField('Employee Type', 'detailsEmployee.employeeType', editedEmployee.detailsEmployee.employeeType, 'select', ['casual', 'full-time', 'part-time'])}
              {renderField('Department', 'detailsEmployee.department', editedEmployee.detailsEmployee.department)}
              {renderField('Position', 'detailsEmployee.position', editedEmployee.detailsEmployee.position)}
              {renderField('Hire Date', 'detailsEmployee.hireDate', new Date(editedEmployee.detailsEmployee.hireDate).toLocaleDateString())}
            </>
          ) : (
            <View style={styles.savingContainer}>
              <ActivityIndicator size="small" color="#4A90E2" />
              <Text style={styles.savingText}>Saving changes...</Text>
            </View>
          )}
          
          <View style={styles.timestamps}>
            <Text style={styles.timestampText}>Created: {new Date(editedEmployee.detailsEmployee.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.timestampText}>Updated: {new Date(editedEmployee.detailsEmployee.updatedAt).toLocaleDateString()}</Text>
          </View>
        </View>
        
        {renderDocumentSection()}
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
            <View style={styles.headerButtons}>
              {isEditing ? (
                <>
                  <TouchableOpacity 
                    onPress={handleSave} 
                    style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                    disabled={isSaving}
                  >
                    <Text style={styles.saveButtonText}>
                      {isSaving ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      setIsEditing(false);
                      setEditedEmployee(employee);
                    }} 
                    style={styles.cancelButton}
                    disabled={isSaving}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                  <MaterialIcons name="edit" size={24} color="#4A90E2" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

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
    maxWidth: 600,
    maxHeight: '90%',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  scrollView: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  initialsCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  initialsText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  detailsSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 40,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    width: '100%',
    marginTop: -8,
  },
  timestamps: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  savingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  documentSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  documentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  documentInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  documentLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  documentValue: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  expiredText: {
    color: '#FF5252',
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#E3F2FD',
  },
  viewButtonText: {
    marginLeft: 4,
    color: '#4A90E2',
    fontSize: 14,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#E8F5E9',
  },
  verifyButtonText: {
    marginLeft: 4,
    color: '#4CAF50',
    fontSize: 14,
  },
  noDocumentsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});

export default EmployeeDetailsModal; 