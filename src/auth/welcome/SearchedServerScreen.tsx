import { useNavigation } from "@react-navigation/native";
import { SearchServerResponse } from "../../api/server/server";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Button,
  Image,
} from "react-native";
import { useSignup } from "../Signup/SignUpContext";
import { useEffect } from "react";
import { u } from "react-native-big-calendar";

interface SearchedServerScreenProps {
  searchedServer: SearchServerResponse;
}

export const SearchedServerScreen = ({ navigation }: { navigation: any }) => {
  const { updateFormData, formData } = useSignup();
  const { inviteLink, serverName } = formData;
  useEffect(() => {
    console.log(formData);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredView}>
        <View style={styles.imgContainer}>
          <Image
            source={require("../../../assets/wpslogo.png")}
            style={styles.image}
          />
        </View>

        <Text style={styles.serverTitle}>Join Now</Text>

        {inviteLink ? (
          <Text style={styles.inviteLink}># {inviteLink}</Text>
        ) : (
          <Text style={styles.inviteLink}>
            You have been invited to create a new server. Click the button below
            to create an account.
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.filledButton}
          onPress={() => {
            navigation.navigate("Signup1");
          }}
        >
          <Text style={styles.buttonText}>Create an Account</Text>
        </TouchableOpacity>

        <Button
          title="Cancel"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  serverTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 10, // Add a small margin to control space
  },
  container: {
    flex: 1, // Adjusted to 1 to take full height, not 2
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
  },
  inviteLink: {
    fontSize: 20,
    color: "#808080",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  imgContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  filledButton: {
    backgroundColor: "#111", // Filled button color
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff", // White text for filled button
    fontSize: 16,
  },
});
