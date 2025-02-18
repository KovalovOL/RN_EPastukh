import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate } from "./data";
import { useRouter } from "expo-router";
import { colorMap } from "./data";
import { LogBox } from 'react-native';

// Suppress specific warnings
LogBox.ignoreLogs(['Warning: Text strings must be rendered within a <Text> component']);


interface GrazingData {
  animal: string;
  quantity: string;
  duration: string;
  location: string;
}

export default function Grazing() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [flag, setFlag] = useState(require("../assets/images/ukraine.png"));
  const [grazingList, setGrazingList] = useState<GrazingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editableGrazing, setEditableGrazing] = useState<GrazingData | null>(
    null
  );
  const [animalDropdownVisible, setAnimalDropdownVisible] = useState(false);
  const [durationDropdownVisible, setDurationDropdownVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        setLanguage(savedLanguage || "en");
        setFlag(
          savedLanguage === "ua"
            ? require("../assets/images/uk.png")
            : require("../assets/images/ukraine.png")
        );

        const grazingData = await AsyncStorage.getItem("grazingList");
        if (grazingData) {
          setGrazingList(JSON.parse(grazingData));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const sendMessageToServer = async () => {
    try {
        // Замените `your-go-server-ip` на IP-адрес вашего Go-сервера
        const response = await fetch('http://192.168.0.171:8080/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Start Grazing' }),
        });

        // Проверяем статус ответа
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Читаем ответ от сервера
        const result = await response.text();
        console.log('Server Response:', result);  // Логируем ответ в консоль
    } catch (error) {
        console.error('Error:', error.message);  // Логируем ошибку в консоль
    }
  };

  

  
  const toggleLanguage = async () => {
    const newLanguage = language === "en" ? "ua" : "en";
    const newFlag =
      newLanguage === "ua"
        ? require("../assets/images/uk.png")
        : require("../assets/images/ukraine.png");

    setLanguage(newLanguage);
    setFlag(newFlag);
    await AsyncStorage.setItem("language", newLanguage);
  };

  const toggleAnimalDropdown = () => {
    setAnimalDropdownVisible((prev) => !prev);
    setDurationDropdownVisible(false);
  };

  const toggleDurationDropdown = () => {
    setDurationDropdownVisible((prev) => !prev);
    setAnimalDropdownVisible(false);
  };

  const handleAnimalSelect = (animal: string) => {
    setEditableGrazing((prev) =>
      prev ? { ...prev, animal } : null
    );
    setAnimalDropdownVisible(false);
  };

  const handleDurationSelect = (duration: string) => {
    setEditableGrazing((prev) =>
      prev ? { ...prev, duration } : null
    );
    setDurationDropdownVisible(false);
  };

  const handleQuantityChange = (quantity: string) => {
    setEditableGrazing((prev) =>
      prev ? { ...prev, quantity } : null
    );
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditableGrazing({ ...grazingList[index] });
  };

  const handleSave = async (index: number) => {
    if (!editableGrazing) return;

    const updatedGrazingList = [...grazingList];
    updatedGrazingList[index] = editableGrazing;
    setGrazingList(updatedGrazingList);

    // Save updated list to local storage
    await AsyncStorage.setItem("grazingList", JSON.stringify(updatedGrazingList));

    setEditIndex(null);
    setEditableGrazing(null);
  };

  const handleStart = async (index: number) => {
    try {
        // Отправляем сообщение на сервер
        await sendMessageToServer();

        // Fetch the specific grazing data based on index
        const grazingData = grazingList[index];

        // Navigate to the `stream` page with the grazing data as a parameter
        router.push({
            pathname: "/stream",
            params: {
                data: JSON.stringify(grazingData), // Pass the data as a stringified object
            },
        });
    } catch (error) {
        console.error("Error navigating to stream page:", error);
    }
  };
  

  const handleDelete = async (index: number) => {
    // Filter out the selected grazing by index
    const updatedGrazingList = grazingList.filter((_, i) => i !== index);
    setGrazingList(updatedGrazingList);
  
    // Save the updated list to local storage
    await AsyncStorage.setItem("grazingList", JSON.stringify(updatedGrazingList));
  
    // If the deleted scenario was in edit mode, exit edit mode
    if (editIndex === index) {
      setEditIndex(null);
      setEditableGrazing(null);
    }
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{translate[language]["Grazing"]}</Text>
        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() =>router.push("/account")}>
            <Image
              source={require("../assets/images/account icon.png")}
              style={styles.user}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleLanguage} style={styles.flagContainer}>
            <Image source={flag} style={styles.flag} />
          </TouchableOpacity>
        </View>
      </View>

      {grazingList.length > 0 ? (
  grazingList.map((grazing, index) => (
    <View key={index} style={styles.grazingCard}>
      <View style={styles.grazingHeader}>
        <Text style={styles.grazingTitle}>
          {translate[language]["Grazing"]} #{index + 1}
        </Text>
        <View style={styles.actionButtons}>
          {editIndex === index ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(index)}
              >
                <Text style={styles.actionText}>➖</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSave(index)}
              >
                <Text style={styles.actionText}>✔️</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(index)}
            >
              <Text style={styles.actionText}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          {editIndex === index ? (
            <>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={toggleAnimalDropdown}
              >
                <Text>
                  {editableGrazing?.animal ||
                    translate[language]["Choose an animal"]}
                </Text>
              </TouchableOpacity>
              {animalDropdownVisible && (
                <View style={styles.dropdownMenu}>
                  {["Cows 🐄", "Horses 🐎", "Goats 🐐"].map((animal) => (
                    <TouchableOpacity
                      key={animal} // Use the original animal string as the key
                      style={styles.dropdownItem}
                      onPress={() => handleAnimalSelect(animal)}
                    >
                      <Text>{translate[language][animal]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.detailText}>
              {translate[language][grazing.animal]}
            </Text>
          )}
        </View>
        <View style={styles.detailBox}>
  {editIndex === index ? (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={toggleDurationDropdown}
      >
        <Text>
          {editableGrazing?.duration ||
            translate[language]["Choose a duration"]}
        </Text>
      </TouchableOpacity>
      {durationDropdownVisible && (
        <View style={styles.dropdownMenu}>
          {["1 Hour", "2 Hours", "3 Hours", "4 Hours", "5 Hours", "6 Hours"].map((duration) => (
            <TouchableOpacity
              key={"6 Hours"} // Use the original duration string as the key
              style={styles.dropdownItem}
              onPress={() => handleDurationSelect(duration)}
            >
              <Text>6 Hours</Text>
              {/* Fallback to `duration` if translation is missing */}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
          ) : (
            <Text style={styles.detailText}>
              {translate[language][grazing.duration]}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          {editIndex === index ? (
            <TextInput
              style={styles.detailInput}
              value={editableGrazing?.quantity || ""}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.detailText}>{grazing.quantity}</Text>
          )}
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailText}>
            {translate[language]["My location"]}
          </Text>
        </View>
      </View>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => handleStart(index)}
      >
        <Text style={styles.startButtonText}>
          {translate[language]["Start"]}
        </Text>
      </TouchableOpacity>

    </View>
  ))
) : (
  <Text style={styles.noDataText}>{translate[language]["No grazing data"]}</Text>
)}


      <TouchableOpacity style={styles.addGrazingButton} onPress={() => router.push("/createGrazing")}>
        <Text style={styles.addGrazingText}>
          + {translate[language]["Add grazing"]}
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorMap.blackText,
  },
  topButtons: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 5,
    borderRadius: 12,
  },
  flagContainer: {
    justifyContent: "center",
  },
  flag: {
    width: 32,
    height: 22,
  },
  userContainer: {
    justifyContent: "center",
    marginRight: 10,
    marginLeft: 10
  },
  user: {
    width: 35,
    height: 35,
  },
  grazingCard: {
    backgroundColor: colorMap.embed,
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
  editButton: {
    fontSize: 18,
    color: colorMap.grayText,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailBox: {
    flex: 1,
    backgroundColor: colorMap.embed2,
    borderRadius: 8,
    padding: 10,
    marginRight: 5,
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    color: colorMap.blackText,
  },
  letsGoButton: {
    backgroundColor: colorMap.greenButton,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  letsGoText: {
    fontSize: 16,
    color: colorMap.whiteText,
    fontWeight: "bold",
  },
  addGrazingButton: {
    backgroundColor: colorMap.greenButton,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  addGrazingText: {
    fontSize: 16,
    color: colorMap.whiteText,
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: colorMap.grayText,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 5,
  },
  actionText: {
    fontSize: 18,
    color: colorMap.grayText,
  },
  detailInput: {
    fontSize: 16,
    color: colorMap.blackText,
    borderBottomWidth: 1,
    borderColor: colorMap.grayText,
    padding: 5,
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: colorMap.grayText,
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownMenu: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 10,
  },
  dropdownItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: colorMap.greenButton,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  startButtonText: {
    fontSize: 16,
    color: colorMap.whiteText,
    fontWeight: "bold",
  },
  
});
