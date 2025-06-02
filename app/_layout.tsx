import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { EditAccountProvider } from './shared/EditAccountContext';

export default function RootLayout() {
  return (
    <EditAccountProvider>
      <>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <StatusBar style="light" />
        </Stack>
        <Toast />
      </>
    </EditAccountProvider>
  );
}
