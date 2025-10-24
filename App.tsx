/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/authStore';
import { useThemeStore } from './src/store/themeStore';
import CompleteProfileModal from './src/components/CompleteProfileModal';

GoogleSignin.configure({
  offlineAccess: false,
});

function App(): JSX.Element {
  const { user, setUser } = useAuthStore();
  const { theme } = useThemeStore();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        setUser(null);
      }
    };

    loadUserFromStorage();

    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          profileComplete: false,
        };
        AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        AsyncStorage.removeItem('user');
        setUser(null);
      }
    });

    return unsubscribe;
  }, [setUser]);

  useEffect(() => {
    if (user && user.profileComplete === false) {
      setShowCompleteProfile(true);
    }
  }, [user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <RootNavigator />
        <CompleteProfileModal
          visible={showCompleteProfile}
          onComplete={() => setShowCompleteProfile(false)}
        />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
