import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const firebaseAuth = auth;
export const firebaseFirestore = firestore;

export const collections = {
  users: () => firestore().collection('users'),
  clients: (userId: string) =>
    firestore().collection('users').doc(userId).collection('clients'),
  charges: (userId: string) =>
    firestore().collection('users').doc(userId).collection('charges'),
};
