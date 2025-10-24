import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { chargesService, Charge } from '../services/chargesService';
import { clientsService, Client } from '../services/clientsService';
import AddChargeModal from '../components/AddChargeModal';

export default function ChargesScreen() {
  const { user } = useAuthStore();
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const loadCharges = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const fetchedCharges = await chargesService.getCharges(user.uid);
      setCharges(fetchedCharges);
    } catch (error: any) {
      console.error('Error loading charges:', error);
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
    loadCharges();
  }, [loadCharges]);

  const getStatusColor = (status: Charge['status']) => {
    switch (status) {
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'overdue':
        return '#ef4444';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: Charge['status']) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Vencido';
      default:
        return '';
    }
  };

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
          <Text style={styles.title}>Cobranças</Text>
          <Text style={styles.subtitle}>
            {charges.length} cobranças registradas
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
        {charges.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="currency-usd" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhuma cobrança registrada</Text>
            <Text style={styles.emptySubtext}>
              Clique no botão + para criar sua primeira cobrança
            </Text>
          </View>
        ) : (
          charges.map(charge => (
            <View key={charge.id} style={styles.chargeCard}>
              <View style={styles.chargeIconContainer}>
                <LinearGradient
                  colors={
                    charge.status === 'paid'
                      ? ['#10b981', '#059669']
                      : charge.status === 'pending'
                      ? ['#f59e0b', '#d97706']
                      : ['#ef4444', '#dc2626']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.chargeIcon}
                >
                  <Icon
                    name={
                      charge.status === 'paid'
                        ? 'check-circle'
                        : charge.status === 'pending'
                        ? 'clock-outline'
                        : 'alert-circle'
                    }
                    size={28}
                    color="#fff"
                  />
                </LinearGradient>
              </View>
              <View style={styles.chargeInfo}>
                <Text style={styles.clientName}>{charge.clientName}</Text>
                <View style={styles.chargeDetail}>
                  <Icon
                    name="text"
                    size={14}
                    color={colors.textSecondaryDark}
                  />
                  <Text style={styles.description}>{charge.description}</Text>
                </View>
                <View style={styles.chargeDetail}>
                  <Icon
                    name="calendar"
                    size={14}
                    color={colors.textSecondaryDark}
                  />
                  <Text style={styles.dueDate}>Vence em {charge.dueDate}</Text>
                </View>
              </View>
              <View style={styles.chargeStats}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(charge.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(charge.status)}
                  </Text>
                </View>
                <Text style={styles.chargeValue}>
                  R$ {charge.value.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <AddChargeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onChargeAdded={loadCharges}
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
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondaryDark,
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
  chargeCard: {
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
  chargeInfo: {
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
  description: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  dueDate: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontFamily: 'Inter-Regular',
  },
  chargeStats: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  chargeValue: {
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
  chargeIconContainer: {
    marginRight: spacing.md,
  },
  chargeIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chargeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
});
