import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import { colorMap, height, translate } from "./data";
import { LogBox } from 'react-native';

// Suppress specific warnings
LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component']);


export default function StartPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("en"); // Default language
  const [flag, setFlag] = useState(require("../assets/images/ukraine.png")); // Default flag
  const [errorMessage, setErrorMessage] = useState(""); // Error message for login

  useEffect(() => {
    async function loadFontsAndLanguage() {
      // Load fonts
      await Font.loadAsync({
        "Inter-Regular": require("../assets/fonts/inter/Inter_18pt-Regular.ttf"),
        "Inter-Bold": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
        "Inter-Italic": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
        "Inter-SemiBold": require("../assets/fonts/inter/Inter_18pt-SemiBold.ttf"),
      });

      // Load language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        setLanguage(savedLanguage);
        setFlag(
          savedLanguage === "ua"
            ? require("../assets/images/uk.png")
            : require("../assets/images/ukraine.png")
        );
      }
    }
    loadFontsAndLanguage();
  }, []);

  const toggleLanguage = async () => {
    const newLanguage = language === "en" ? "ua" : "en";
    const newFlag =
      newLanguage === "ua"
        ? require("../assets/images/uk.png")
        : require("../assets/images/ukraine.png");

    // Update language and flag
    setLanguage(newLanguage);
    setFlag(newFlag);

    // Save to AsyncStorage
    await AsyncStorage.setItem("language", newLanguage);
  };

  const handleLogIn = async () => {
    const userData = await AsyncStorage.getItem("userData");
    const grazingList = await AsyncStorage.getItem("grazingData");
    if (userData) {
      if (grazingList){
        router.push("home") 
      }
      else{
        router.push("hello")
      }
    }
    else{
      console.log("no")
    }
  }

  return (
    <View style={styles.container}>
      {/* Flag */}
      <TouchableOpacity onPress={toggleLanguage} style={styles.flagContainer}>
        <Image source={flag} style={styles.flag} />
      </TouchableOpacity>

      {/* Header Section */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonSignUp}
          onPress={() => router.push("/signUp")} // Navigates to the sign-up screen
        >
          <Text style={styles.buttonText}>{translate[language]["Sign up"]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLogIn}
          onPress={handleLogIn} // Checks for user data and handles login
        >
          <Text style={styles.buttonText}>{translate[language]["Log in"]}</Text>
        </TouchableOpacity>
        {/* Display error message if login fails */}
        {errorMessage !== "" && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  logo: {
    width: 340,
    height: 340,
  },
  buttonsContainer: {
    paddingTop: 60,
    paddingBottom: 30,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 18,
    color: colorMap.whiteText,
    fontFamily: "Inter-Regular",
  },
  flagContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  flag: {
    width: 30,
    height: 20,
    resizeMode: "contain",
  },
  buttonSignUp: {
    width: "100%",
    height: height,
    backgroundColor: colorMap.greenButton,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
  },
  buttonLogIn: {
    backgroundColor: colorMap.grayButton,
    width: "100%",
    height: height,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
});
