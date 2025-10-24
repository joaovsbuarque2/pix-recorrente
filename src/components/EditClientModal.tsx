import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { Client } from '../services/clientsService';
import {
  validateEmail,
  validateCPF,
  validateCNPJ,
  formatPhone,
  formatCPF,
  formatCNPJ,
} from '../utils/validators';

interface EditClientModalProps {
  visible: boolean;
  client: Client | null;
  onClose: () => void;
  onClientUpdated: () => void;
}

export default function EditClientModal({
  visible,
  client,
  onClose,
  onClientUpdated,
}: EditClientModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email || '');
      setPhone(client.phone);
      setCpf(client.cpf || '');
      setCnpj(client.cnpj || '');
      setAddress(client.address || '');
      setNotes(client.notes || '');
      setStatus(client.status);
    }
  }, [client]);

  const handleSave = async () => {
    if (!client) return;

    if (!name.trim() || !phone.trim()) {
      Alert.alert('Erro', 'Nome e WhatsApp são obrigatórios');
      return;
    }

    if (email && !validateEmail(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    if (cpf && !validateCPF(cpf)) {
      Alert.alert('Erro', 'CPF inválido');
      return;
    }

    if (cnpj && !validateCNPJ(cnpj)) {
      Alert.alert('Erro', 'CNPJ inválido');
      return;
    }

    try {
      setLoading(true);
      const { clientsService } = await import('../services/clientsService');
      const { useAuthStore } = await import('../store/authStore');
      const user = useAuthStore.getState().user;

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      await clientsService.updateClient(user.uid, client.id, {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim(),
        cpf: cpf.trim() || undefined,
        cnpj: cnpj.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        status,
        totalPaid: client.totalPaid,
        totalCharges: client.totalCharges,
      });

      Alert.alert('Sucesso', 'Cliente atualizado com sucesso');
      onClientUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o cliente');
    } finally {
      setLoading(false);
    }
  };

  if (!client) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={0}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Cliente</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados Principais</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Nome Completo <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome do cliente"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  WhatsApp <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={colors.textSecondary}
                  value={phone}
                  onChangeText={text => setPhone(formatPhone(text))}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@exemplo.com"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Documentos</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  placeholderTextColor={colors.textSecondary}
                  value={cpf}
                  onChangeText={text => setCpf(formatCPF(text))}
                  keyboardType="number-pad"
                  maxLength={14}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>CNPJ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="00.000.000/0000-00"
                  placeholderTextColor={colors.textSecondary}
                  value={cnpj}
                  onChangeText={text => setCnpj(formatCNPJ(text))}
                  keyboardType="number-pad"
                  maxLength={18}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Adicionais</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rua, número, bairro, cidade"
                  placeholderTextColor={colors.textSecondary}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Notas sobre o cliente..."
                  placeholderTextColor={colors.textSecondary}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      status === 'active' && styles.statusButtonActive,
                    ]}
                    onPress={() => setStatus('active')}
                  >
                    <Icon
                      name="check-circle"
                      size={20}
                      color={
                        status === 'active'
                          ? colors.success
                          : colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.statusButtonText,
                        status === 'active' && styles.statusButtonTextActive,
                      ]}
                    >
                      Ativo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      status === 'inactive' && styles.statusButtonInactive,
                    ]}
                    onPress={() => setStatus('inactive')}
                  >
                    <Icon
                      name="close-circle"
                      size={20}
                      color={
                        status === 'inactive'
                          ? colors.error
                          : colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.statusButtonText,
                        status === 'inactive' &&
                          styles.statusButtonTextInactive,
                      ]}
                    >
                      Inativo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  form: {
    padding: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Medium',
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.backgroundDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 100,
    paddingTop: spacing.md,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundDark,
    gap: spacing.xs,
  },
  statusButtonActive: {
    borderColor: colors.success,
    backgroundColor: `${colors.success}15`,
  },
  statusButtonInactive: {
    borderColor: colors.error,
    backgroundColor: `${colors.error}15`,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    fontFamily: 'Inter-Medium',
  },
  statusButtonTextActive: {
    color: colors.success,
  },
  statusButtonTextInactive: {
    color: colors.error,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
});
