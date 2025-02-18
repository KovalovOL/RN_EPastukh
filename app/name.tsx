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
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Font from "expo-font";
import { colorMap, height, translate } from "./data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from 'react-native';

// Suppress specific warnings
LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component']);


export default function Name() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [language, setLanguage] = useState("en"); // Default language

  const [name, setName] = useState<string>(""); // Name input state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadFontsAndLanguage() {
      await Font.loadAsync({
        "Inter-Regular": require("../assets/fonts/inter/Inter_18pt-Regular.ttf"),
        "Inter-Bold": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
        "Inter-Italic": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
        "Inter-SemiBold": require("../assets/fonts/inter/Inter_18pt-SemiBold.ttf"),
      });

      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    }
    loadFontsAndLanguage();
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      if (params.email)
        setEmail(Array.isArray(params.email) ? params.email[0] : params.email);
      if (params.password)
        setPassword(
          Array.isArray(params.password) ? params.password[0] : params.password
        );
      if (params.repeatPassword)
        setRepeatPassword(
          Array.isArray(params.repeatPassword)
            ? params.repeatPassword[0]
            : params.repeatPassword
        );
      if (params.name) {setName(Array.isArray(params.name) ? params.name[0] : params.name)};
      setAgree(true); // Always set to true
      setIsInitialized(true);
    }
  }, [params, isInitialized]);

  const handleNext = async () => {
    try {
      // Remove GrazingList from local storage
      await AsyncStorage.removeItem("grazingList");
  
      // Create a userData object
      const userData = {
        email,
        password,
        name,
      };
  
      // Save the userData object to local storage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
  
      // Navigate to hello.tsx
      router.push("/hello");
    } catch (error) {
      console.error("Error removing GrazingList or saving user data:", error);
    }
  };

  
  

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
              onPress={() =>
                router.push({
                  pathname: "/signUp",
                  params: { email, password, repeatPassword, name, agree: "true" },
                })
              }
              style={styles.backButtonContainer}
            >
              <Image
                source={require("../assets/images/back.png")}
                style={styles.backButton}
              />
            </TouchableOpacity>
            <Text style={styles.header}>
              {translate[language]["Create account"]}
            </Text>
            <View style={styles.placeholder} /> {/* Balances the layout */}
          </View>
          <Image
            source={require("../assets/images/account icon.png")}
            style={styles.accountIcon}
            />

          {/* Name Section */}
          <Text style={styles.label}>
            {translate[language]["What's your name?"]}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={translate[language]["Name"]}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Text style={styles.subLabel}>
            {translate[language]["This appears on your profile"]}
          </Text>

          {/* Next Button */}
          <TouchableOpacity
            style={[styles.buttonNext, { backgroundColor: colorMap.greenButton }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {translate[language]["Create account"]}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    defaultText: {
      fontFamily: 'Inter-Regular'
    },
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
      fontFamily: 'Inter-SemiBold',
      textAlign: "center",
    },
    placeholder: {
      width: 30,
    },
    label: {
      fontSize: 18,
      fontFamily: 'Inter-Regular',
      marginTop: 10,
    },
    subLabel: {
      fontSize: 13,
      color: colorMap.blackText,
      marginBottom: 5,
    },
    input: {
      borderRadius: 12,
      padding: 12,
      marginBottom: 15,
      fontSize: 14,
      backgroundColor: colorMap.input,
      marginTop: 12,
      height: height
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    passwordInput: {
      flex: 1,
      //marginRight: 10,
      marginTop: 10,
    },
    eyeIcon: {
      position: "absolute",
      right: 10,
      padding: 10,
      alignSelf: "center",
    },
    eyeImage: {
      width: 20,
      height: 20,
    },
    privacyPolicy: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      marginTop: 20,
    },
    checkbox: {
      marginRight: 10,
    },
    checkboxText: {
      fontSize: 18,
    },
    privacyText: {
      fontSize: 14,
      color: "#555",
    },
    privacyLink: {
      color: "#4CAF50",
      textDecorationLine: "underline",
    },
    buttonNext: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      width: 150,
      alignSelf: "center",
      justifyContent: "center",
      marginTop: 10,
      height: height,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "Inter-Regular"
    },
    orText: {
      textAlign: "center",
      fontSize: 18,
      color: colorMap.backText,
      marginVertical: 20,
    },
    buttonSocial: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colorMap.grayButton,
      borderRadius: 15,
      marginBottom: 10,
      justifyContent: "center",
      height: height
    },
    buttonIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    buttonTextSocial: {
      color: "#ffffff",
      fontSize: 17,
      fontFamily: "Inter-Regular"
    },
    accountIcon: {
        width: 100,
        height: 100,
        alignSelf: "center"
      },
  });
