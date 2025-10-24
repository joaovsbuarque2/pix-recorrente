import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddClientModal from '../components/AddClientModal';
import ClientDetailModal from '../components/ClientDetailModal';
import EditClientModal from '../components/EditClientModal';
import { borderRadius, colors, spacing, typography } from '../constants/theme';
import { Client, clientsService } from '../services/clientsService';
import { useAuthStore } from '../store/authStore';

export default function ClientsScreen() {
  const { user } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadClients = useCallback(async () => {
    if (!user?.uid) {
      return;
    }
    try {
      setLoading(true);
      const fetchedClients = await clientsService.getClients(user.uid);
      setClients(fetchedClients);
      setFilteredClients(fetchedClients);
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

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        client =>
          client.name.toLowerCase().includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.phone.includes(query) ||
          client.cpf?.includes(query) ||
          client.cnpj?.includes(query),
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const handleDeleteClient = useCallback(
    async (clientId: string, clientName: string) => {
      Alert.alert(
        'Excluir Cliente',
        `Tem certeza que deseja excluir ${clientName}? Esta ação não pode ser desfeita.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              try {
                await clientsService.deleteClient(user!.uid, clientId);
                await loadClients();
                Alert.alert('Sucesso', 'Cliente excluído com sucesso');
              } catch (error) {
                console.error('Error deleting client:', error);
                Alert.alert('Erro', 'Não foi possível excluir o cliente');
              }
            },
          },
        ],
      );
    },
    [user, loadClients],
  );

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
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Clientes</Text>
          <Text style={styles.subtitle}>
            {filteredClients.length} de {clients.length} clientes
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome, email, telefone ou documento..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.list}>
        {filteredClients.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-group" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
            <Text style={styles.emptySubtext}>
              Clique no botão + para adicionar seu primeiro cliente
            </Text>
          </View>
        ) : (
          filteredClients.map(client => (
            <TouchableOpacity
              key={client.id}
              style={styles.clientCard}
              onPress={() => {
                setSelectedClient(client);
                setDetailModalVisible(true);
              }}
            >
              <View style={styles.clientCardContent}>
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
                  <Text style={styles.clientCharges}>
                    {client.totalCharges}{' '}
                    {client.totalCharges === 1 ? 'cobrança' : 'cobranças'}
                  </Text>
                  <Text style={styles.clientTotal}>
                    R$ {client.totalPaid.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.clientActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedClient(client);
                    setDetailModalVisible(true);
                  }}
                >
                  <Icon name="cash-plus" size={20} color={colors.success} />
                  <Text style={styles.actionText}>Cobrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedClient(client);
                    setEditModalVisible(true);
                  }}
                >
                  <Icon name="pencil" size={20} color={colors.warning} />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteClient(client.id, client.name)}
                >
                  <Icon name="delete" size={20} color={colors.error} />
                  <Text style={styles.actionText}>Excluir</Text>
                </TouchableOpacity>
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

      <EditClientModal
        visible={editModalVisible}
        client={selectedClient}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedClient(null);
        }}
        onClientUpdated={loadClients}
      />

      <ClientDetailModal
        visible={detailModalVisible}
        client={selectedClient}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedClient(null);
        }}
        onCreateCharge={client => {
          setDetailModalVisible(false);
          Alert.alert(
            'Em desenvolvimento',
            'Modal de criar cobrança será implementado em breve',
          );
        }}
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
  headerLeft: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Inter-Regular',
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
  clientCardContent: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surfaceDark,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  clientDocument: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontFamily: 'Inter-Regular',
  },
  clientCharges: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  clientActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: colors.surfaceDark,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  actionText: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    fontFamily: 'Inter-Medium',
  },
});
