import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
// import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { deleteToken } from "../../../api/auth/token";
import { useAuth } from "../../../context/AuthContext";

const SettingsScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Settings");
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

const { setIsAuthenticated, setUserRole } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<{
    [key: string]: boolean;
  }>({
    Profile: true,
    Preferences: true,
    "Company Info": true,
    "App Configuration": true,
    "Leave & Attendance Rules": true,
    Support: true,
  });

  const isMobile = screenWidth <= 768;

  useEffect(() => {
    const updateWidth = () => setScreenWidth(Dimensions.get("window").width);
    const subscription = Dimensions.addEventListener("change", updateWidth);
    return () => subscription.remove();
  }, []);

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = async () => {
    await deleteToken("accessToken");
    await deleteToken("refreshToken");
    await deleteToken("serverId");
    await deleteToken("officeId");
  
    setIsAuthenticated(false);
    setUserRole("");
  
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedTab={selectedTab}
        handleTabChange={setSelectedTab}
      /> */}

      <View
        style={[
          styles.scrollWrapper,
          // { marginLeft: isMobile ? 0 : isSidebarOpen ? 250 : 0 },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.mainContent}>
            <Text style={styles.title}>Settings</Text>

            {[
              {
                title: "Profile",
                content: (
                  <>
                    <TextInput style={styles.input} placeholder="Name" />
                    <TextInput style={styles.input} placeholder="Email" />
                    <TextInput style={styles.input} placeholder="Phone" />
                    <TextInput
                      style={styles.input}
                      placeholder="Change Password"
                      secureTextEntry
                    />
                    <TouchableOpacity style={styles.saveBtn}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  </>
                ),
              },
              {
                title: "Preferences",
                content: (
                  <>
                    <View style={styles.preferenceRow}>
                      <Text>Dark Mode</Text>
                      <Switch value={darkMode} onValueChange={setDarkMode} />
                    </View>
                    <View style={styles.preferenceRow}>
                      <Text>Notifications</Text>
                      <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                      />
                    </View>
                    <TouchableOpacity style={styles.saveBtn}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  </>
                ),
              },
              {
                title: "Company Info",
                content: (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Company Name"
                    />
                    <TextInput style={styles.input} placeholder="ABN" />
                    <TextInput
                      style={styles.input}
                      placeholder="Business Address"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Support Email"
                    />
                    <TouchableOpacity style={styles.saveBtn}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  </>
                ),
              },
              {
                title: "App Configuration",
                content: (
                  <>
                    <TextInput style={styles.input} placeholder="App Version" />
                    <TextInput
                      style={styles.input}
                      placeholder="Default Timezone"
                    />
                    <TouchableOpacity style={styles.saveBtn}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  </>
                ),
              },
              {
                title: "Leave & Attendance Rules",
                content: (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Max Leave Days per Year"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Attendance Tolerance (minutes)"
                      keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.saveBtn}>
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  </>
                ),
              },
              {
                title: "Support",
                content: (
                  <>
                    <TouchableOpacity>
                      <Text style={styles.link}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.link}>Terms & Conditions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.link}>Contact Us</Text>
                    </TouchableOpacity>
                  </>
                ),
              },
            ].map((section) => (
              <View style={styles.section} key={section.title}>
                <TouchableOpacity
                  style={styles.sectionTitleRow}
                  onPress={() => toggleSection(section.title)}
                >
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {collapsedSections[section.title] ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronUp size={18} />
                  )}
                </TouchableOpacity>
                {!collapsedSections[section.title] && section.content}
              </View>
            ))}

<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  scrollWrapper: {
    flex: 1,
    height: "100%",
    ...Platform.select({
      web: { overflowY: "scroll" },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  mainContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  link: {
    color: "#4A90E2",
    textDecorationLine: "underline",
    marginBottom: 8,
  },
  logoutBtn: {
    backgroundColor: "#D9534F",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#4A90E2",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default SettingsScreen;
