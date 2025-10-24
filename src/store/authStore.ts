import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);
    set({ user });
  },

  signUp: async (email: string, password: string) => {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);
    set({ user });
  },

  signInWithGoogle: async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  signOut: async () => {
    await auth().signOut();
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('password');
    set({ user: null });
  },

  setUser: (user: User | null) => set({ user, loading: false }),
}));
