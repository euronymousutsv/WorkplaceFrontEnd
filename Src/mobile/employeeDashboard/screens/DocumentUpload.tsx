import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import {
  uploadEmployeeDocument,
  UploadDocumentRequest,
} from "../../../api/document/documentApi";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { getToken } from "../../../api/auth/token";

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";

const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState<"License" | "National ID">(
    "License"
  );
  const [documentId, setDocumentId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const [selectedIssueDate, setSelectedIssueDate] = useState(new Date());
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const onIssueDateChange = (event: any, selectedDate?: Date) => {
    setShowIssueDatePicker(false);
    if (selectedDate) {
      setSelectedIssueDate(selectedDate);
      setIssueDate(formatDate(selectedDate));
    }
  };

  const onExpiryDateChange = (event: any, selectedDate?: Date) => {
    setShowExpiryDatePicker(false);
    if (selectedDate) {
      setSelectedExpiryDate(selectedDate);
      setExpiryDate(formatDate(selectedDate));
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        setSelectedFile(result);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleUpload = async () => {
    if (
      !selectedFile?.assets?.[0] ||
      !documentId ||
      !expiryDate ||
      !issueDate
    ) {
      Alert.alert("Error", "Please fill all fields and select a document");
      return;
    }

    try {
      setUploading(true);

      // Step 1: Upload file to bucket
      const formData = new FormData();
      const file = selectedFile.assets[0];

      // Create file object matching the Postman request
      formData.append("file", {
        uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
        type: file.mimeType || "image/jpeg",
        name: file.name || "document.jpg",
      } as any);

      console.log("Step 1: Uploading file to bucket:", {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      });

      const uploadResponse = await axios.post(
        "https://workplace-zdzja.ondigitalocean.app/api/v1/file/upload?bucketName=workhive-chats",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
          },
          transformRequest: (data, headers) => {
            return formData; // Prevent axios from trying to transform FormData
          },
        }
      );

      console.log("Upload response:", uploadResponse.data);

      if (!uploadResponse?.data?.success) {
        throw new Error("Failed to upload file to bucket");
      }

      const fileUrl = uploadResponse.data.data.fileUrl;
      console.log("File uploaded successfully. URL:", fileUrl);

      // Step 2: Create document record with the file URL
      console.log("Step 2: Creating document record with URL");
      const userId = await getToken("userId");
      const documentRequest = {
        employeeId: userId || "",
        documentType: documentType,
        documentid: Number(documentId),
        issueDate: issueDate,
        expiryDate: expiryDate,
        docsURL: fileUrl,
      };

      console.log("Document request:", documentRequest);

      const documentResponse = await uploadEmployeeDocument(documentRequest);
      console.log("Document response:", documentResponse);

      if (documentResponse instanceof Error) {
        console.error("Document creation failed:", documentResponse);
        throw new Error("Failed to create document record");
      }

      console.log("Document created successfully:", documentResponse);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Document uploaded and record created successfully",
      });

      // Reset form
      setSelectedFile(null);
      setDocumentId("");
      setExpiryDate("");
      setIssueDate("");
    } catch (error: any) {
      console.error("Error in upload process:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to complete the upload process"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Document Type</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              documentType === "License" && styles.typeButtonActive,
            ]}
            onPress={() => setDocumentType("License")}
          >
            <Text
              style={[
                styles.typeButtonText,
                documentType === "License" && styles.typeButtonTextActive,
              ]}
            >
              License
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              documentType === "National ID" && styles.typeButtonActive,
            ]}
            onPress={() => setDocumentType("National ID")}
          >
            <Text
              style={[
                styles.typeButtonText,
                documentType === "National ID" && styles.typeButtonTextActive,
              ]}
            >
              National ID
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Document ID</Text>
        <TextInput
          style={styles.input}
          value={documentId}
          onChangeText={setDocumentId}
          placeholder="Enter Document ID"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Issue Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowIssueDatePicker(true)}
        >
          <Text>{issueDate || "Select Issue Date"}</Text>
        </TouchableOpacity>
        {showIssueDatePicker && (
          <DateTimePicker
            value={selectedIssueDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onIssueDateChange}
            minimumDate={new Date(1900, 0, 1)}
            maximumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Expiry Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowExpiryDatePicker(true)}
        >
          <Text>{expiryDate || "Select Expiry Date"}</Text>
        </TouchableOpacity>
        {showExpiryDatePicker && (
          <DateTimePicker
            value={selectedExpiryDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onExpiryDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <MaterialIcons name="cloud-upload" size={24} color="#4A90E2" />
        <Text style={styles.uploadButtonText}>
          {selectedFile?.assets?.[0]?.name || "Select Document"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Upload Document</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  typeButtons: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  typeButtonText: {
    color: "#666",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#4A90E2",
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadButtonText: {
    marginLeft: 10,
    color: "#4A90E2",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DocumentUpload;
