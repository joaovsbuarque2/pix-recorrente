import { collections } from './firebase';

export interface Charge {
  id: string;
  clientName: string;
  value: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  description: string;
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChargesService {
  async getCharges(userId: string): Promise<Charge[]> {
    try {
      const snapshot = await collections
        .charges(userId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Charge[];
    } catch (error) {
      console.error('Error getting charges:', error);
      throw error;
    }
  }

  async addCharge(
    userId: string,
    chargeData: Omit<Charge, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    try {
      const now = new Date();
      const docRef = await collections.charges(userId).add({
        ...chargeData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding charge:', error);
      throw error;
    }
  }

  async updateCharge(
    userId: string,
    chargeId: string,
    updates: Partial<Omit<Charge, 'id' | 'createdAt'>>,
  ): Promise<void> {
    try {
      await collections
        .charges(userId)
        .doc(chargeId)
        .update({
          ...updates,
          updatedAt: new Date(),
        });
    } catch (error) {
      console.error('Error updating charge:', error);
      throw error;
    }
  }

  async deleteCharge(userId: string, chargeId: string): Promise<void> {
    try {
      await collections.charges(userId).doc(chargeId).delete();
    } catch (error) {
      console.error('Error deleting charge:', error);
      throw error;
    }
  }
}

export const chargesService = new ChargesService();
