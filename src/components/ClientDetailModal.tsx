import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { Client } from '../services/clientsService';
import { Charge, chargesService } from '../services/chargesService';
import { useAuthStore } from '../store/authStore';

interface ClientDetailModalProps {
  visible: boolean;
  client: Client | null;
  onClose: () => void;
  onCreateCharge: (client: Client) => void;
}

export default function ClientDetailModal({
  visible,
  client,
  onClose,
  onCreateCharge,
}: ClientDetailModalProps) {
  const { user } = useAuthStore();
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (client && user?.uid) {
      loadCharges();
    }
  }, [client, user?.uid]);

  const loadCharges = async () => {
    if (!client || !user?.uid) return;
    try {
      setLoading(true);
      const allCharges = await chargesService.getCharges(user.uid);
      const clientCharges = allCharges.filter(
        charge => charge.clientId === client.id,
      );
      setCharges(clientCharges);
    } catch (error) {
      console.error('Error loading charges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'overdue':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Vencido';
      default:
        return status;
    }
  };

  if (!client) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{client.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Histórico de Cobranças</Text>
                <TouchableOpacity
                  style={styles.createChargeButton}
                  onPress={() => onCreateCharge(client)}
                >
                  <Icon name="plus" size={16} color="#fff" />
                  <Text style={styles.createChargeText}>Nova Cobrança</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : charges.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon
                    name="file-document-outline"
                    size={48}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.emptyText}>
                    Nenhuma cobrança encontrada
                  </Text>
                </View>
              ) : (
                <View style={styles.chargesList}>
                  {charges.map(charge => (
                    <View key={charge.id} style={styles.chargeCard}>
                      <View style={styles.chargeHeader}>
                        <View style={styles.chargeInfo}>
                          <Text style={styles.chargeValue}>
                            R$ {charge.value.toFixed(2)}
                          </Text>
                          <Text style={styles.chargeDate}>
                            Vencimento: {charge.dueDate}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.chargeStatus,
                            {
                              backgroundColor: `${getStatusColor(
                                charge.status,
                              )}20`,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.chargeStatusText,
                              { color: getStatusColor(charge.status) },
                            ]}
                          >
                            {getStatusText(charge.status)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total de Cobranças:</Text>
                  <Text style={styles.summaryValue}>{client.totalCharges}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Recebido:</Text>
                  <Text
                    style={[styles.summaryValue, styles.summaryValueSuccess]}
                  >
                    R$ {client.totalPaid.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {},
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  createChargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  createChargeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  chargesList: {
    gap: spacing.md,
    maxHeight: 200, // Adjust as needed
  },
  chargeCard: {
    backgroundColor: colors.backgroundDark,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chargeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chargeInfo: {
    flex: 1,
  },
  chargeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  chargeDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  chargeStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  chargeStatusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  summaryCard: {
    backgroundColor: colors.backgroundDark,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter-Medium',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  summaryValueSuccess: {
    color: colors.success,
  },
});
