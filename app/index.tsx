import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";

export default function App() {
  const [isAppReady, setAppReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Prevent the splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();

    // Simulate a loading process (e.g., fetching resources)
    setTimeout(() => {
      setAppReady(true); // App is ready, but don't navigate yet
    }, 3000); // Simulate a 3-second loading time
  }, []);

  const handleVideoFinish = () => {
    if (isAppReady) {
      SplashScreen.hideAsync(); // Hide the splash screen
      router.push("/start"); // Navigate to start.tsx
    }
  };

  return (
    <View style={styles.container}>
      {!hasPlayed ? (
        <Video
          source={require("../assets/images/logo.mp4")} // Replace with your video file path
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              setHasPlayed(true);
              handleVideoFinish();
            }
          }}
          shouldPlay
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Match your app's background color
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
