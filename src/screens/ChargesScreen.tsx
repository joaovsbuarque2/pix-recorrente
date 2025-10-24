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
        {charges.map(charge => (
          <TouchableOpacity key={charge.id} style={styles.chargeCard}>
            <LinearGradient
              colors={['rgba(138, 5, 190, 0.08)', 'rgba(0, 208, 158, 0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.chargeInfo}>
                <Text style={styles.clientName}>{charge.clientName}</Text>
                <Text style={styles.description}>{charge.description}</Text>
                <Text style={styles.dueDate}>Vencimento: {charge.dueDate}</Text>
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
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
    backgroundColor: 'rgba(138, 5, 190, 0.05)',
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
});
