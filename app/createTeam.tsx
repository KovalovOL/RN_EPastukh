import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { colorMap, translate, height } from "./data";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateTeam() {
  const router = useRouter();
  const [language, setLanguage] = useState("en"); // Default language
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dronePassword, setDronePassword] = useState("");
  const [shepherdPasswords, setShepherdPasswords] = useState<string[]>([""]); // Shepherd passwords array

  // Load fonts and language
  useEffect(() => {
    async function loadFontsAndLanguage() {
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
        setLanguage(savedLanguage || "en"); // Use saved language or default to "en"

        setFontsLoaded(true); // Mark fonts as loaded
      } catch (error) {
        console.error("Error loading fonts or language:", error);
      }
    }

    loadFontsAndLanguage();
  }, []);

  const addShepherdPassword = () => {
    setShepherdPasswords([...shepherdPasswords, ""]);
  };

  const handleShepherdPasswordChange = (text: string, index: number) => {
    const updatedPasswords = [...shepherdPasswords];
    updatedPasswords[index] = text;
    setShepherdPasswords(updatedPasswords);
  };

  const handleNext = () => {
    // Prepare data to pass
    const createTeamData = {
      dronePassword,
      shepherdPasswords,
    };
  
    // Navigate to Grazing page with params
    router.push({
      pathname: "/createGrazing",
      params: {
        createTeamData: JSON.stringify(createTeamData), // Pass as a string
      },
    });
  };
  

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* Top Header Section */}
          <View style={styles.top}>
            <TouchableOpacity
              onPress={() => router.push("/hello")}
              style={styles.backButtonContainer}
            >
              <Image
                source={require("../assets/images/back.png")}
                style={styles.backButton}
              />
            </TouchableOpacity>
            <Text style={styles.header}>
              {translate[language]["Create a team"]}
            </Text>
            <View style={styles.placeholder} /> {/* Balances the layout */}
          </View>

          {/* Drone Password Section */}
          <Text style={styles.label}>
            {translate[language]["What is your drone's password?"]}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={translate[language]["Enter the drone ID"]}
            value={dronePassword}
            onChangeText={setDronePassword}
          />

          {/* Shepherd Passwords Section */}
          {shepherdPasswords.map((password, index) => (
            <View key={index}>
              <Text style={styles.label}>
                {translate[language][`What's the ID of your shepherd`] + ` #${index + 1}?`}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={translate[language]["Enter the drone ID"]}
                value={password}
                onChangeText={(text) => handleShepherdPasswordChange(text, index)}
              />
            </View>
          ))}

          {/* Add Shepherd Button */}
          <TouchableOpacity
            style={styles.addShepherdButton}
            onPress={addShepherdPassword}
          >
            <Text style={styles.addShepherdButtonText}>
              + {translate[language]["Add shepherd"]}
            </Text>
          </TouchableOpacity>

          {/* Next Button */}
          <View style={styles.nextButtonContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {translate[language]["Next"]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
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
  header: {
    flex: 1,
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
  },
  placeholder: {
    width: 30,
  },
  label: {
    fontSize: 18,
    fontFamily: "Inter-Regular",
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: colorMap.input,
    height: height,
  },
  addShepherdButton: {
    borderRadius: 12,
    backgroundColor: colorMap.greenButton,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginVertical: 20,
  },
  addShepherdButtonText: {
    color: colorMap.blackText,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  nextButton: {
    borderRadius: 12,
    backgroundColor: colorMap.greenButton,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    width: 120,
    position: "absolute", // Absolutely positioned at the bottom
    bottom: 20, // Stick to the bottom
  },
  nextButtonText: {
    color: colorMap.whiteText,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  nextButtonContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
});
