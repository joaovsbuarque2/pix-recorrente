import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { clientsService, Client } from '../services/clientsService';
import AddClientModal from '../components/AddClientModal';

export default function ClientsScreen() {
  const { user } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const loadClients = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const fetchedClients = await clientsService.getClients(user.uid);
      setClients(fetchedClients);
    } catch (error: any) {
      console.error('Error loading clients:', error);
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Permissões do Firestore',
          'As regras de segurança do Firestore não estão configuradas. Execute "firebase deploy --only firestore:rules" no terminal do projeto para permitir acesso aos dados.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clientes</Text>
          <Text style={styles.subtitle}>
            {clients.length} clientes cadastrados
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {clients.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-group" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
            <Text style={styles.emptySubtext}>
              Clique no botão + para adicionar seu primeiro cliente
            </Text>
          </View>
        ) : (
          clients.map(client => (
            <TouchableOpacity key={client.id} style={styles.clientCard}>
              <View style={styles.clientIconContainer}>
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.clientIcon}
                >
                  <Icon name="account" size={32} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <View style={styles.clientDetail}>
                  <Icon
                    name="email"
                    size={14}
                    color={colors.textSecondaryDark}
                  />
                  <Text style={styles.clientEmail}>{client.email}</Text>
                </View>
                <View style={styles.clientDetail}>
                  <Icon
                    name="phone"
                    size={14}
                    color={colors.textSecondaryDark}
                  />
                  <Text style={styles.clientPhone}>{client.phone}</Text>
                </View>
              </View>
              <View style={styles.clientStats}>
                <View
                  style={[
                    styles.statusBadge,
                    client.status === 'active'
                      ? styles.statusActive
                      : styles.statusInactive,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
                <Text style={styles.clientTotal}>
                  R$ {client.totalPaid.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <AddClientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onClientAdded={loadClients}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  clientCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardGradient: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceDark,
  },
  clientInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  clientEmail: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  clientPhone: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontFamily: 'Inter-Regular',
  },
  clientStats: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  statusActive: {
    backgroundColor: '#10b981',
  },
  statusInactive: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  clientTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: spacing.lg,
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    fontFamily: 'Inter-Regular',
  },
  clientIconContainer: {
    marginRight: spacing.md,
  },
  clientIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
});
