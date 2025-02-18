import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { colorMap, translate } from "./data";

interface GrazingData {
  animal: string;
  quantity: string;
  duration: string;
  location: string;
}

interface UserData {
  name: string;
  email: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [flag, setFlag] = useState(require("../assets/images/ukraine.png"));
  const [userData, setUserData] = useState<UserData | null>(null);
  const [grazingList, setGrazingList] = useState<GrazingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch language preference
        const savedLanguage = await AsyncStorage.getItem("language");
        if (savedLanguage && savedLanguage !== language) {
          setLanguage(savedLanguage);
          setFlag(
            savedLanguage === "ua"
              ? require("../assets/images/uk.png")
              : require("../assets/images/ukraine.png")
          );
        }
  
        // Fetch user data
        const savedUserData = await AsyncStorage.getItem("userData");
        const parsedUserData = savedUserData ? JSON.parse(savedUserData) : null;
        if (JSON.stringify(parsedUserData) !== JSON.stringify(userData)) {
          setUserData(parsedUserData);
        }
  
        // Fetch grazing list
        const savedGrazingList = await AsyncStorage.getItem("grazingList");
        const parsedGrazingList = savedGrazingList ? JSON.parse(savedGrazingList) : [];
        if (JSON.stringify(parsedGrazingList) !== JSON.stringify(grazingList)) {
          setGrazingList(parsedGrazingList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchData();
    // Only run on component mount
  }, []);
  

  const handleAddGrazing = () => {
    router.push("/createGrazing");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{translate[language]["Loading..."]}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Header Section */}
      <View style={styles.top}>
        <TouchableOpacity
          onPress={() => router.push("/home")} // Navigate back
          style={styles.backButtonContainer}
        >
          <Image
            source={require("../assets/images/back.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.header}>{translate[language]["Account"]}</Text>
        <View style={styles.placeholder} /> {/* Balances the layout */}
      </View>

      {/* User Data Section */}
      <View style={styles.userCard}>
        <Image
          source={require("../assets/images/account icon.png")}
          style={styles.userIcon}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData?.name}</Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
        </View>
      </View>

      {/* Grazing List Section */}
      {grazingList.length > 0 ? (
        grazingList.map((grazing, index) => (
          <View key={index} style={styles.grazingCard}>
            <View style={styles.grazingHeader}>
              <Text style={styles.grazingTitle}>
                {translate[language]["Grazing"]} #{index + 1}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailBox}>
                <Text style={styles.detailText}>{grazing.animal}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailText}>{grazing.duration}</Text>
              </View>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailBox}>
                <Text style={styles.detailText}>{grazing.quantity}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailText}>{translate[language]["My location"]}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>{translate[language]["No grazing data"]}</Text>
      )}

      {/* Add Grazing Button */}
      <TouchableOpacity style={styles.addGrazingButton} onPress={handleAddGrazing}>
        <Text style={styles.addGrazingText}>
          + {translate[language]["Add grazing"]}
        </Text>
      </TouchableOpacity>

      {/* Footer Link */}
      <TouchableOpacity onPress={() => Linking.openURL("https://www.google.com")}>
        <Text style={styles.footerLink}>
          {translate[language]["You can read about us here"]}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: colorMap.grayText,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
  },
  backButton: {
    width: 30,
    height: 30,
  },
  placeholder: {
    width: 30,
  },
  header: {
    flex: 1,
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorMap.blackText,
  },
  userEmail: {
    fontSize: 14,
    color: colorMap.grayText,
  },
  grazingCard: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  grazingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  grazingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorMap.blackText,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailBox: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    padding: 10,
    marginRight: 5,
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    color: colorMap.blackText,
  },
  addGrazingButton: {
    backgroundColor: colorMap.greenButton,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  addGrazingText: {
    fontSize: 16,
    color: colorMap.whiteText,
    fontWeight: "bold",
  },
  footerLink: {
    textAlign: "center",
    fontSize: 14,
    color: colorMap.blueText,
    textDecorationLine: "underline",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: colorMap.grayText,
    marginBottom: 20,
  },
});
