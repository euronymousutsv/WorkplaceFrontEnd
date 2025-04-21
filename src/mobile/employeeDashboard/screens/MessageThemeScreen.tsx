import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { saveToken } from "../../../api/auth/token";
export const themes = {
  "blue-pink": {
    10: require("../../../../assets/chat-background/blue-pink-10-pct.png"),
    15: require("../../../../assets/chat-background/blue-pink-15-pct.png"),
    20: require("../../../../assets/chat-background/blue-pink-20-pct.png"),
    100: require("../../../../assets/chat-background/blue-pink-100-pct.png"),
  },
  "orange-red": {
    10: require("../../../../assets/chat-background/orange-red-10-pct.png"),
    15: require("../../../../assets/chat-background/orange-red-15-pct.png"),
    20: require("../../../../assets/chat-background/orange-red-20-pct.png"),
    100: require("../../../../assets/chat-background/orange-red-100-pct.png"),
  },
  rainbow: {
    10: require("../../../../assets/chat-background/rainbow-10-pct.png"),
    15: require("../../../../assets/chat-background/rainbow-15-pct.png"),
    20: require("../../../../assets/chat-background/rainbow-20-pct.png"),
    100: require("../../../../assets/chat-background/rainbow-100-pct.png"),
  },
  teal: {
    10: require("../../../../assets/chat-background/teal-10-pct.png"),
    15: require("../../../../assets/chat-background/teal-15-pct.png"),
    20: require("../../../../assets/chat-background/teal-20-pct.png"),
    100: require("../../../../assets/chat-background/teal-100-pct.png"),
  },
  "white-grey": {
    10: require("../../../../assets/chat-background/white-grey-10-pct.png"),
    15: require("../../../../assets/chat-background/white-grey-15-pct.png"),
    20: require("../../../../assets/chat-background/white-grey-20-pct.png"),
    100: require("../../../../assets/chat-background/white-grey-100-pct.png"),
  },
  "yellow-green": {
    10: require("../../../../assets/chat-background/yellow-green-10-pct.png"),
    15: require("../../../../assets/chat-background/yellow-green-15-pct.png"),
    20: require("../../../../assets/chat-background/yellow-green-20-pct.png"),
    100: require("../../../../assets/chat-background/yellow-green-100-pct.png"),
  },
};
export const MessageThemeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof themes>("blue-pink");
  const [percent, setPercent] = useState<10 | 15 | 20 | 100>(10);

  useEffect(() => {
    saveToken("selectedTheme", selectedTheme);
    saveToken("selectedThemePercent", String(percent));
  }, [selectedTheme, percent]);

  return (
    <ImageBackground
      source={themes[selectedTheme][percent]}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Message Theme</Text>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Change Theme & Background</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Choose Theme</Text>

              {Object.keys(themes).map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.selectButton,
                    selectedTheme === theme && styles.activeButton,
                  ]}
                  onPress={() => setSelectedTheme(theme as keyof typeof themes)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      selectedTheme === theme && styles.activeButtonText,
                    ]}
                  >
                    {theme}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.modalTitle}>Select Background Opacity</Text>

              {[10, 15, 20, 100].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.selectButton,
                    percent === value && styles.activeButton,
                  ]}
                  onPress={() => setPercent(value as 10 | 15 | 20 | 100)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      percent === value && styles.activeButtonText,
                    ]}
                  >
                    {value}%
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: "#0077cc",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  modalView: {
    flex: 1,
    backgroundColor: "#fefefe",
    borderRadius: 20,
    padding: 25,
    margin: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#333",
  },
  selectButton: {
    backgroundColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginVertical: 6,
  },
  activeButton: {
    backgroundColor: "#0077cc",
  },
  activeButtonText: {
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "#cc0000",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

export default MessageThemeScreen;
