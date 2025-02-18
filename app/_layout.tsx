import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="privacyPolicy" />
      <Stack.Screen name="start" />
      <Stack.Screen name="name" />
      <Stack.Screen name="hello" />
      <Stack.Screen name="createTeam" />
      <Stack.Screen name="createGazing" />
      <Stack.Screen name="location" />
      <Stack.Screen name="home" />
      <Stack.Screen name="stream" />
      <Stack.Screen name="account" />
    </Stack>
  );
}
