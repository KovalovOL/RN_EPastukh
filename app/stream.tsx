import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate, colorMap } from "./data";
import { WebView } from 'react-native-webview';

// Define the GrazingData type
interface GrazingData {
  animal: string;
  quantity: string;
  duration: string;
  location: string;
  droneID: string;
  shepherdIDs: string[];
}

export default function StreamPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [language, setLanguage] = useState("en");
  const [flag, setFlag] = useState(require("../assets/images/ukraine.png"));
  const [grazingData, setGrazingData] = useState<GrazingData | null>(null); // Explicitly type grazingData

  const sendMessageToServer = async () => {
    try {
        // Замените `your-go-server-ip` на IP-адрес вашего Go-сервера
        const response = await fetch('http://192.168.0.171:8080/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'End Grazing' }),
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

  useEffect(() => {
    async function fetchLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        if (savedLanguage && savedLanguage !== language) {
          setLanguage(savedLanguage);
          setFlag(
            savedLanguage === "ua"
              ? require("../assets/images/uk.png")
              : require("../assets/images/ukraine.png")
          );
        }
      } catch (error) {
        console.error("Error fetching language:", error);
      }
    }

    fetchLanguage();
  }, []); // Runs only on component mount

  useEffect(() => {
    if (params.data) {
      try {
        const parsedData: GrazingData = JSON.parse(
          Array.isArray(params.data) ? params.data[0] : params.data
        );
        if (JSON.stringify(parsedData) !== JSON.stringify(grazingData)) {
          setGrazingData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing params:", error);
      }
    }
  }, [params.data]); // Runs only when params.data changes

  const handleComplete = async () => {
    await sendMessageToServer();
    router.push("/home"); // Navigate back to grazing list
  };

  if (!grazingData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{translate[language]["Loading..."]}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Image
            source={require("../assets/images/back.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.header}>{translate[language]["Stream"]}</Text>
        <TouchableOpacity onPress={() => router.push("/account")}>
          <Image source={flag} style={styles.flag} />
        </TouchableOpacity>
      </View>

      {/* Stream Content */}
      <View style={styles.streamContainer}>

          <WebView
                source={{ html: `
                    <html>
                        <body style="margin: 0;">
                            <img src="http://192.168.0.171:8000/video_feed" style="width: 100%; height: 100%;" />
                        </body>
                    </html>
                ` }}
            />

        <TouchableOpacity style={styles.fullScreenButton}>
          <Text>🔳</Text>
        </TouchableOpacity>
      </View>

      {/* Grazing Data */}
      <View style={styles.grazingCard}>
        <Text style={styles.grazingTitle}>
          {translate[language]["Grazing"]} #{params.index || 1}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>
              {translate[language][grazingData.animal] || grazingData.animal}
            </Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>
              {translate[language][grazingData.duration] || grazingData.duration}
            </Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>
              {translate[language]["Quantity"]}: {grazingData.quantity}
            </Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>
              {translate[language]["My location"]}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.grazingTitle}>
            {translate[language]["Main drone ID"]}
          </Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailBox2}>
              <Text style={styles.detailText2}>{grazingData.droneID}</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.grazingTitle}>{translate[language]["Shepherd drone IDs"]}</Text>
          {grazingData.shepherdIDs.map((shepherdID, index) => (
            <View key={index} style={styles.detailsContainer}>
              <View style={styles.detailBox2}>
                <Text style={styles.detailText2}>
                  {translate[language]["Shepherd ID"]} {shepherdID}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Complete Button */}
      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>
          {translate[language]["Complete"]}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
  backButton: {
    width: 30,
    height: 30,
  },
  flag: {
    width: 32,
    height: 22,
  },
  streamContainer: {
    backgroundColor: colorMap.embed,
    borderRadius: 12,
    height: 200,
    marginBottom: 20,
    position: "relative",
  },

  fullScreenButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  grazingCard: {
    backgroundColor: colorMap.embed,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  grazingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorMap.blackText,
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailsContainer2: {
    flexDirection: "column",
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
  detailBox2: {
    flex: 1,
    backgroundColor: colorMap.embed2,
    borderRadius: 8,
    padding: 10,
    marginRight: 5,
  },
  detailText: {
    fontSize: 16,
    color: colorMap.blackText,
  },
  detailText2: {
    fontSize: 16,
    color: colorMap.blackText,
    marginLeft: 5,
  },
  completeButton: {
    backgroundColor: colorMap.greenButton,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  completeButtonText: {
    fontSize: 16,
    color: colorMap.whiteText,
    fontWeight: "bold",
  },
});
