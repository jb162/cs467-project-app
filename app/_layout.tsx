import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EditAccountProvider } from './shared/EditAccountContext';

export default function RootLayout() {
  return (
    <EditAccountProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <StatusBar style="light" />
        <Stack.Screen name="editAccount" options={{ title: "" }} />
      </Stack>
    </EditAccountProvider>
  );
}
