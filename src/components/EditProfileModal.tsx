import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';
import { usersService, UserProfile } from '../services/usersService';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import {
  validatePhone,
  validateCPF,
  validateCNPJ,
  validatePixKey,
  formatPhone,
  formatCPF,
  formatCNPJ,
} from '../utils/validators';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export default function EditProfileModal({
  visible,
  onClose,
  onProfileUpdated,
}: EditProfileModalProps) {
  const { user, updateUserProfile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [bankName, setBankName] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');

  useEffect(() => {
    if (visible && user?.uid) {
      loadProfile();
    }
  }, [visible, user?.uid]);

  const loadProfile = async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const profile = await usersService.getUserProfile(user.uid);
      if (profile) {
        setDisplayName(profile.displayName);
        setPhone(formatPhone(profile.phone || ''));
        setCpf(profile.cpf ? formatCPF(profile.cpf) : '');
        setCnpj(profile.cnpj ? formatCNPJ(profile.cnpj) : '');
        setPixKey(profile.pixKey || '');
        setBankName(profile.bankData?.bankName || '');
        setAgencia(profile.bankData?.agencia || '');
        setConta(profile.bankData?.conta || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Erro', 'Falha ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Erro', 'Nome completo é obrigatório');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Erro', 'WhatsApp é obrigatório');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Erro', 'Número de telefone inválido');
      return;
    }

    if (!pixKey.trim()) {
      Alert.alert('Erro', 'Chave PIX é obrigatória');
      return;
    }

    if (!validatePixKey(pixKey)) {
      Alert.alert('Erro', 'Chave PIX inválida');
      return;
    }

    if (cpf.trim() && !validateCPF(cpf)) {
      Alert.alert('Erro', 'CPF inválido');
      return;
    }

    if (cnpj.trim() && !validateCNPJ(cnpj)) {
      Alert.alert('Erro', 'CNPJ inválido');
      return;
    }

    try {
      const updateData: any = {
        displayName: displayName.trim(),
        phone: phone.replace(/\D/g, ''),
        pixKey: pixKey.trim(),
      };

      if (cpf.trim()) {
        updateData.cpf = cpf.replace(/\D/g, '');
      }

      if (cnpj.trim()) {
        updateData.cnpj = cnpj.replace(/\D/g, '');
      }

      if (bankName.trim() || agencia.trim() || conta.trim()) {
        updateData.bankData = {};
        if (bankName.trim()) updateData.bankData.bankName = bankName.trim();
        if (agencia.trim()) updateData.bankData.agencia = agencia.trim();
        if (conta.trim()) updateData.bankData.conta = conta.trim();
      }

      await usersService.updateUserProfile(user!.uid, updateData);

      updateUserProfile({
        displayName: displayName.trim(),
      });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      onProfileUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erro', 'Falha ao atualizar perfil');
    }
  };

  const handlePhoneChange = (text: string) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 11) {
      setPhone(formatPhone(clean));
    }
  };

  const handleCPFChange = (text: string) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 11) {
      setCpf(formatCPF(clean));
    }
  };

  const handleCNPJChange = (text: string) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 14) {
      setCnpj(formatCNPJ(clean));
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Perfil</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollContent}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome completo"
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>WhatsApp *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={15}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Chave PIX *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email, telefone, CPF ou chave aleatória"
                  value={pixKey}
                  onChangeText={setPixKey}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.separator} />
              <Text style={styles.sectionTitle}>Documentos</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChangeText={handleCPFChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={14}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>CNPJ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChangeText={handleCNPJChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={18}
                />
              </View>

              <View style={styles.separator} />
              <Text style={styles.sectionTitle}>Dados Bancários</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do Banco</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Banco do Brasil"
                  value={bankName}
                  onChangeText={setBankName}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Agência</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0000"
                  value={agencia}
                  onChangeText={setAgencia}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Conta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="00000-0"
                  value={conta}
                  onChangeText={setConta}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </ScrollView>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
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
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: colors.backgroundDark,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  cancelText: {
    color: colors.text,
  },
});
