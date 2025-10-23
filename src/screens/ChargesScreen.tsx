import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface Charge {
  id: string;
  clientName: string;
  value: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  description: string;
}

export default function ChargesScreen() {
  const charges: Charge[] = [
    {
      id: '1',
      clientName: 'João Silva',
      value: 150,
      status: 'paid',
      dueDate: '2024-10-15',
      description: 'Mensalidade Outubro',
    },
    {
      id: '2',
      clientName: 'Maria Santos',
      value: 200,
      status: 'pending',
      dueDate: '2024-10-20',
      description: 'Serviço de Consultoria',
    },
    {
      id: '3',
      clientName: 'Pedro Costa',
      value: 100,
      status: 'overdue',
      dueDate: '2024-10-10',
      description: 'Assinatura Premium',
    },
    {
      id: '4',
      clientName: 'Ana Oliveira',
      value: 300,
      status: 'paid',
      dueDate: '2024-10-12',
      description: 'Projeto Desenvolvimento',
    },
  ];

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cobranças</Text>
          <Text style={styles.subtitle}>
            {charges.length} cobranças registradas
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {charges.map(charge => (
          <TouchableOpacity key={charge.id} style={styles.chargeCard}>
            <View style={styles.cardGradient}>
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
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
