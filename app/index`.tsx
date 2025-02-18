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

export default function StartPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("en"); // Default language
  const [flag, setFlag] = useState(require("../assets/images/ukraine.png")); // Default flag

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
    const newFlag = newLanguage === "ua"
      ? require("../assets/images/uk.png")
      : require("../assets/images/ukraine.png");

    // Update language and flag
    setLanguage(newLanguage);
    setFlag(newFlag);

    // Save to AsyncStorage
    await AsyncStorage.setItem("language", newLanguage);
  };

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
          onPress={() => router.push("/signUp")} // Navigates to the log-in screen (adjust if needed)
        >
          <Text style={styles.buttonText}>{translate[language]["Log in"]}</Text>
        </TouchableOpacity>
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
    justifyContent: "center"
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
  orText: {
    textAlign: "center",
    fontSize: 14,
    color: colorMap.blackText,
    fontFamily: "Inter-Regular",
    marginVertical: 10,
  },
  buttonSocial: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    justifyContent: "center",
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonTextSocial: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
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
});
