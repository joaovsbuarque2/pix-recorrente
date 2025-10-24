import { collections } from './firebase';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  status: 'active' | 'inactive';
  totalPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ClientsService {
  async getClients(userId: string): Promise<Client[]> {
    try {
      const snapshot = await collections
        .clients(userId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Client[];
    } catch (error) {
      console.error('Error getting clients:', error);
      throw error;
    }
  }

  async addClient(
    userId: string,
    clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    try {
      const now = new Date();
      const docRef = await collections.clients(userId).add({
        ...clientData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  }

  async updateClient(
    userId: string,
    clientId: string,
    updates: Partial<Omit<Client, 'id' | 'createdAt'>>,
  ): Promise<void> {
    try {
      await collections
        .clients(userId)
        .doc(clientId)
        .update({
          ...updates,
          updatedAt: new Date(),
        });
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  async deleteClient(userId: string, clientId: string): Promise<void> {
    try {
      await collections.clients(userId).doc(clientId).delete();
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
}

export const clientsService = new ClientsService();
