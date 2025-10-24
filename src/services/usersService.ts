import { collections } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  cnpj?: string;
  cpf?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  pixKey: string;
  bankData?: {
    bankName?: string;
    agencia?: string;
    conta?: string;
    tipoConta?: 'corrente' | 'poupanca';
  };
  createdAt: Date;
  updatedAt: Date;
}

export class UsersService {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const doc = await collections.users().doc(userId).get();
      if (!doc.exists) {
        return null;
      }
      return {
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate(),
        updatedAt: doc.data()?.updatedAt?.toDate(),
      } as UserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async createUserProfile(
    userId: string,
    profileData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    try {
      const now = new Date();
      await collections
        .users()
        .doc(userId)
        .set({
          ...profileData,
          createdAt: now,
          updatedAt: now,
        });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>,
  ): Promise<void> {
    try {
      const cleanUpdates: any = {};

      Object.keys(updates).forEach(key => {
        const value = (updates as any)[key];
        if (value !== undefined && value !== null) {
          if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            !(value instanceof Date)
          ) {
            const cleanedObject: any = {};
            Object.keys(value).forEach(subKey => {
              if (
                value[subKey] !== undefined &&
                value[subKey] !== null &&
                value[subKey] !== ''
              ) {
                cleanedObject[subKey] = value[subKey];
              }
            });
            if (Object.keys(cleanedObject).length > 0) {
              cleanUpdates[key] = cleanedObject;
            }
          } else if (value !== '') {
            cleanUpdates[key] = value;
          }
        }
      });

      const docRef = collections.users().doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        await docRef.set({
          ...cleanUpdates,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        await docRef.update({
          ...cleanUpdates,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async deleteUserProfile(userId: string): Promise<void> {
    try {
      await collections.users().doc(userId).delete();
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }
}

export const usersService = new UsersService();
