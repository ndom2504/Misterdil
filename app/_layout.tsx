import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProvider, useApp } from '@/context/AppContext';
import { Colors } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, needsPhoneVerification } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const onOtpScreen = segments[1] === 'otp';

    if (needsPhoneVerification && !onOtpScreen) {
      router.replace('/(auth)/otp');
      return;
    }

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, needsPhoneVerification, segments]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerTintColor: Colors.primary, headerTitleStyle: { fontWeight: '600' } }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="package/new" options={{ title: 'Nouveau colis', presentation: 'modal' }} />
        <Stack.Screen name="package/[id]" options={{ title: 'Détail du colis' }} />
        <Stack.Screen name="transit-address" options={{ title: 'Adresse de transit' }} />
        <Stack.Screen name="delivery/[id]" options={{ title: 'Choix de livraison' }} />
        <Stack.Screen name="tracking/[id]" options={{ title: 'Suivi du colis' }} />
        <Stack.Screen name="payment/[packageId]" options={{ title: 'Paiement', presentation: 'modal' }} />
        <Stack.Screen name="support/index" options={{ title: 'Assistance' }} />
        <Stack.Screen name="assistant/index" options={{ title: 'Assistant d\'achat' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}
