import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DocumentViewerModalProps {
  isVisible: boolean;
  onClose: () => void;
  documentUrl: string;
  documentType: string;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isVisible,
  onClose,
  documentUrl,
  documentType,
}) => {
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
            <Text style={styles.modalTitle}>View Document</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.documentContainer}>
            {documentType === 'image' ? (
              <Image
                source={{ uri: documentUrl }}
                style={styles.documentImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.pdfContainer}>
                <Text style={styles.pdfText}>PDF Viewer will be implemented here</Text>
                <Text style={styles.pdfUrl}>{documentUrl}</Text>
              </View>
            )}
          </View>
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
    maxWidth: 800,
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
  closeButton: {
    padding: 8,
  },
  documentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  documentImage: {
    width: '100%',
    height: Dimensions.get('window').height * 0.6,
    resizeMode: 'contain',
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pdfText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  pdfUrl: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default DocumentViewerModal; 