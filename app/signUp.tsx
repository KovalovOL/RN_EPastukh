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


export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [language, setLanguage] = useState("en"); // Default language

  // Inputs state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isPrivacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);

  // Load fonts and language preference
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

  // Initialize input values if returning from another page
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
      if (params.agree) setAgree(params.agree === "true");
      setIsInitialized(true);
    }
  }, [params, isInitialized]);

  const handlePrivacyPolicyCheckbox = () => {
    setPrivacyPolicyChecked(!isPrivacyPolicyChecked);
  };

  const handleNavigateToName = async () => {
    router.push({
      pathname: "/name",
      params: {
        email,
        password,
        repeatPassword,
        agree: agree.toString(),
      },
    });
  };
  

  const handleNavigateToPrivacyPolicy = () => {
    router.push({
      pathname: "/privacyPolicy",
      params: { email, password, repeatPassword, agree: agree.toString() },
    });
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
              onPress={() => router.push("/start")} // Example navigation back
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

          {/* Email Section */}
          <Text style={styles.label}>
            {translate[language]["What's your email?"]}
          </Text>
          <Text style={styles.subLabel}>
            {translate[language]["You’ll need to confirm this email later"]}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          {/* Password Section */}
          <Text style={styles.label}>
            {translate[language]["Create a password"]}
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder={translate[language]["Enter your password"]}
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Image
                source={
                  isPasswordVisible
                    ? require("../assets/images/eye.png")
                    : require("../assets/images/crossed eye.png")
                }
                style={styles.eyeImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subLabel}>
            {translate[language]["Use at least 8 characters"]}
          </Text>

          {/* Confirm Password Section */}
          <Text style={styles.label}>
            {translate[language]["Repeat the password"]}
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder={translate[language]["Repeat your password"]}
              secureTextEntry={!isConfirmPasswordVisible}
              value={repeatPassword}
              onChangeText={(text) => setRepeatPassword(text)}
            />
            <TouchableOpacity
              onPress={() =>
                setConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
              style={styles.eyeIcon}
            >
              <Image
                source={
                  isConfirmPasswordVisible
                    ? require("../assets/images/eye.png")
                    : require("../assets/images/crossed eye.png")
                }
                style={styles.eyeImage}
              />
            </TouchableOpacity>
          </View>

          {/* Privacy Policy Checkbox */}
          <View style={styles.privacyPolicy}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={handlePrivacyPolicyCheckbox}
            >
              <Text style={styles.checkboxText}>
                {isPrivacyPolicyChecked ? "☑" : "☐"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.privacyText}>
              {translate[language]["I agree to the"]}{" "}
              <Text
                style={styles.privacyLink}
                onPress={handleNavigateToPrivacyPolicy}
              >
                {translate[language]["Privacy Policy"]}
              </Text>
              .
            </Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[
              styles.buttonNext,
              {
                backgroundColor: isPrivacyPolicyChecked
                  ? colorMap.greenButton
                  : colorMap.grayButton,
              },
            ]}
            disabled={!isPrivacyPolicyChecked}
            onPress={handleNavigateToName}
          >
            <Text style={styles.buttonText}>
              {translate[language].Next}
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
    color: "#777",
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
    width: 130,
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
});
