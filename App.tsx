/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/authStore';
import { useThemeStore } from './src/store/themeStore';

GoogleSignin.configure({
  offlineAccess: false,
});

function App(): JSX.Element {
  const setUser = useAuthStore(state => state.setUser);
  const { theme } = useThemeStore();

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <RootNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
