import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";


type NoOfficeScreenNavigationProp = StackNavigationProp<RootStackParamList, "NoOffice">;

const NoOfficeScreen: React.FC = () => {
  const navigation = useNavigation<NoOfficeScreenNavigationProp>();

  const handleRetry = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageBox}>
        <Text style={styles.title}>Not Assigned to Office</Text>
        <Text style={styles.subtitle}>
          You are not currently assigned to any office. Please contact your administrator.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFF",
    justifyContent: "center",
    alignItems: "center",
  },
  messageBox: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#393D3F",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NoOfficeScreen;
