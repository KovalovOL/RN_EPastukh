import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Font from "expo-font";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colorMap, translate, height } from "./data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from 'react-native';

// Suppress specific warnings
LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component']);


export default function Hello() {
  const router = useRouter();
  const [language, setLanguage] = useState("en"); // Default language
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "", name: "" }); // User data state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Load fonts, language, and user data
  useEffect(() => {
    async function initialize() {
      try {
        // Load fonts
        await Font.loadAsync({
          "Inter-Regular": require("../assets/fonts/inter/Inter_18pt-Regular.ttf"),
          "Inter-Bold": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
          "Inter-Italic": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
          "Inter-SemiBold": require("../assets/fonts/inter/Inter_18pt-SemiBold.ttf"),
        });
  
        // Load language preference
        const savedLanguage = await AsyncStorage.getItem("language");
        console.log("Saved language from AsyncStorage:", savedLanguage); // Debugging log
        if (savedLanguage) {
          setLanguage(savedLanguage);
        } else {
          console.warn("No language found in AsyncStorage, using default 'en'");
        }
  
        // Load user data
        const email = await AsyncStorage.getItem("user_email");
        const password = await AsyncStorage.getItem("user_password");
        const name = await AsyncStorage.getItem("user_name");
  
        setUserData({
          email: email || "",
          password: password || "",
          name: name || "",
        });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        // Set loading to false
        setIsLoading(false);
        setFontsLoaded(true);
      }
    }
  
    initialize();
  }, []);
  

  // Display a loading screen until all data is loaded
  if (isLoading || !fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
      <Text style={styles.welcomeText}>
          {/* {translate[language]["Hello"]}, */}Привіт,
        </Text>
        <Text style={styles.infoText}>
          {/* {userData.name || translate[language]["User"]}! */}Козаче!
        </Text>
     </View>
      <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/createGrazing")} // Navigates to the sign-up screen
        >
          <Text style={styles.buttonText}>{translate[language]["Start"]}</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    flex: 1,
    justifyContent: "space-between", // Space between items
    alignItems: "center",
    padding: 20,
  },
  textContainer: {
    marginTop: 100,
    alignItems: "center"
  },
  loadingText: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    color: colorMap.primaryText,
  },
  welcomeText: {
    fontSize: 46,
    fontFamily: "Inter-SemiBold",
    marginTop: 60,
    color: colorMap.blackText,
  },
  infoText: {
    fontSize: 30,
    fontFamily: "Inter-Regular",
    color: colorMap.grayText,
    marginTop: 10,
  },
  button: {
    width: "100%",
    height: height,
    backgroundColor: colorMap.greenButton,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: colorMap.whiteText,
    fontFamily: "Inter-Regular",
  },
});
