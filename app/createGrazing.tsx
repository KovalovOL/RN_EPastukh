import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { translate, colorMap, height } from "./data";
import { useRouter } from "expo-router";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from 'react-native';

// Suppress specific warnings
LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component']);


export default function CreateGrazing() {
  const router = useRouter();
  const [animalDropdownVisible, setAnimalDropdownVisible] = useState(false);
  const [durationDropdownVisible, setDurationDropdownVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [quantity, setQuantity] = useState(""); // Input state for quantity
  const [dronePassword, setDronePassword] = useState(""); // Observer drone input
  const [shepherdPasswords, setShepherdPasswords] = useState<string[]>([""]); // Shepherd drone inputs
  const [language, setLanguage] = useState("en"); // Default language
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
  
        // Check if grazingList exists in local storage
        const grazingList = await AsyncStorage.getItem("grazingList");
        if (grazingList !== null) {
          setBackButtonDestination("/home"); // GrazingList exists
        } else {
          setBackButtonDestination("/hello"); // GrazingList does not exist
        }
  
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error during initialization:", error);
        setBackButtonDestination("/hello"); // Default fallback
      }
    }
  
    initialize();
  }, []);
  
  // State for back button destination
  const [backButtonDestination, setBackButtonDestination] = useState("/hello"); // Default destination  

  const toggleAnimalDropdown = () => {
    setAnimalDropdownVisible((prev) => !prev);
    setDurationDropdownVisible(false);
  };

  const toggleDurationDropdown = () => {
    setDurationDropdownVisible((prev) => !prev);
    setAnimalDropdownVisible(false);
  };

  const handleAnimalSelect = (animal: string) => {
    setSelectedAnimal(animal);
    setAnimalDropdownVisible(false);
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    setDurationDropdownVisible(false);
  };

  const addShepherdPassword = () => {
    setShepherdPasswords([...shepherdPasswords, ""]);
  };

  const handleShepherdPasswordChange = (text: string, index: number) => {
    const updatedPasswords = [...shepherdPasswords];
    updatedPasswords[index] = text;
    setShepherdPasswords(updatedPasswords);
  };

  const handleNext = async () => {
    try {
      // Retrieve existing grazing list from storage
      const grazingListString = await AsyncStorage.getItem("grazingList");
      const grazingList = grazingListString ? JSON.parse(grazingListString) : [];

      // Prepare new grazing data
      const newGrazing = {
        animal: selectedAnimal,
        quantity,
        duration: selectedDuration,
        location: "My location", // Static for now
        droneID: dronePassword, // Observer drone
        shepherdIDs: shepherdPasswords.filter((id) => id.trim() !== ""), // Remove empty inputs
      };

      // Debugging: Print new data to console
      console.log("New Grazing Data:", JSON.stringify(newGrazing, null, 2));

      // Add new grazing to list
      grazingList.push(newGrazing);

      // Save updated list to local storage
      await AsyncStorage.setItem("grazingList", JSON.stringify(grazingList));

      // Navigate back to grazing page
      router.push("/home");
    } catch (error) {
      console.error("Error saving grazing data:", error);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Header Section */}
      <View style={styles.top}>
        <TouchableOpacity
          onPress={() => router.push(backButtonDestination)}
          style={styles.backButtonContainer}
        >
          <Image source={require("../assets/images/back.png")} style={styles.backButton} />
        </TouchableOpacity>

        <Text style={styles.header}>{translate[language]["Create grazing"]}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Animal Dropdown */}
      <TouchableOpacity style={styles.dropdown} onPress={toggleAnimalDropdown}>
        <Text style={styles.dropdownText}>
          {selectedAnimal || translate[language]["Choose the type of animal"]}
        </Text>
      </TouchableOpacity>
      {animalDropdownVisible && (
        <View style={styles.dropdownMenu}>
          {["Cows 🐄", "Goats 🐐", "Ducks 🦆", "Horses 🐎", "Sheep 🐑", "Donkeys 🐴"].map(
            (animal) => (
              <TouchableOpacity
                key={animal}
                style={styles.dropdownItem}
                onPress={() => handleAnimalSelect(animal)}
              >
                <Text style={styles.dropdownItemText}>
                  {translate[language][animal]}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      )}


      {/* Quantity Input */}
      <TextInput
        style={styles.input}
        placeholder={translate[language]["Enter the quantity"]}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {/* Duration Dropdown */}
      <TouchableOpacity style={styles.dropdown} onPress={toggleDurationDropdown}>
        <Text style={styles.dropdownText}>
          {selectedDuration || translate[language]["Choose the duration of the walk"]}
        </Text>
      </TouchableOpacity>
      {durationDropdownVisible && (
        <View style={styles.dropdownMenu}>
          {[translate[language]["1 Hour"], translate[language]["2 Hours"], translate[language]["3 Hours"], translate[language]["4 Hours"], translate[language]["5 Hours"], translate[language]["6 Hours"]].map((duration) => (
            <TouchableOpacity
              key={duration}
              style={styles.dropdownItem}
              onPress={() => handleDurationSelect(duration)}
            >
              <Text style={styles.dropdownItemText}>{duration}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Drone Password */}
      <View>
        <Text style={styles.header2}>{translate[language]["Drone team"]}</Text>
      </View>
      <Text style={styles.label}>{translate[language]["Enter the main drone ID"]}</Text>
      <TextInput
        style={styles.input}
        placeholder={translate[language]["Drone ID"]}
        value={dronePassword}
        onChangeText={setDronePassword}
      />

      {/* Shepherd Drone Passwords */}
      {shepherdPasswords.map((password, index) => (
        <View key={index}>
          <Text style={styles.label}>
            {translate[language][`Shepherd drone ID`] + ` #${index + 1}`}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={translate[language]["Drone ID"]}
            value={password}
            onChangeText={(text) => handleShepherdPasswordChange(text, index)}
          />
        </View>
      ))}

      {/* Add Shepherd Button */}
      <TouchableOpacity style={styles.addShepherdButton} onPress={addShepherdPassword}>
        <Text style={styles.addShepherdButtonText}>+ {translate[language]["Add shepherd"]}</Text>
      </TouchableOpacity>

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{translate[language]["Next"]}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 30,
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
  header2: {
    flex: 1,
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30
  },
  
  placeholder: {
    width: 30,
  },
  dropdown: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: colorMap.input,
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: colorMap.blackText,
  },
  dropdownMenu: {
    backgroundColor: colorMap.input,
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colorMap.blackText,
  },
  input: {
    borderRadius: 12,
    backgroundColor: colorMap.input,
    height: height,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colorMap.blackText,
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
    color: colorMap.whiteText,
    fontSize: 16,
  },
  nextButtonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  nextButton: {
    borderRadius: 12,
    backgroundColor: colorMap.greenButton,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    width: 120,
  },
  nextButtonText: {
    color: colorMap.whiteText,
    fontSize: 16,
  },
});
