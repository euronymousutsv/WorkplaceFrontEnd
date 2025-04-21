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
import { getToken, saveToken } from "../../../api/auth/token";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

export const themes = {
  white: require("../../../../assets/chat-background/white.png"),
  black: require("../../../../assets/chat-background/black.jpg"),
  birds: require("../../../../assets/chat-background/birds.jpg"),
  cartoons: require("../../../../assets/chat-background/cartoons.jpg"),
  clouds: require("../../../../assets/chat-background/clouds.jpg"),
  doodle: require("../../../../assets/chat-background/doodle.jpg"),

  random: require("../../../../assets/chat-background/random.jpg"),
  sky: require("../../../../assets/chat-background/sky.jpg"),
};

export const MessageThemeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof themes>("white");

  useEffect(() => {
    const getSelectedTheme = async () => {
      const token = await getToken("selectedTheme");
      if (token && Object.keys(themes).includes(token)) {
        setSelectedTheme(token as keyof typeof themes);
      } else {
        setSelectedTheme("white"); // fallback
      }
    };
    getSelectedTheme();
  }, []);

  useEffect(() => {
    saveToken("selectedTheme", selectedTheme);
  }, [selectedTheme]);

  return (
    <ImageBackground
      source={themes[selectedTheme]}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Choose Theme</Text>
              <View style={styles.gridContainer}>
                {Object.keys(themes).map((theme) => (
                  <TouchableOpacity
                    key={theme}
                    style={[
                      styles.selectButton,
                      selectedTheme === theme && styles.activeButton,
                    ]}
                    onPress={() =>
                      setSelectedTheme(theme as keyof typeof themes)
                    }
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
              </View>
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
    backgroundColor: "#222",
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
    backgroundColor: "#fefefe",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "80%",
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
  closeButtonContainer: {
    alignItems: "flex-end",
  },
  closeButton: {
    backgroundColor: "#cc0000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    justifyContent: "center",
  },
});

export default MessageThemeScreen;
