import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';
import { usersService } from '../services/usersService';
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

interface CompleteProfileModalProps {
  visible: boolean;
  onComplete: () => void;
}

export default function CompleteProfileModal({
  visible,
  onComplete,
}: CompleteProfileModalProps) {
  const { user, updateUserProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cpf, setCpf] = useState('');
  const [pixKey, setPixKey] = useState('');

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

      await usersService.updateUserProfile(user!.uid, updateData);

      updateUserProfile({
        displayName: displayName.trim(),
        profileComplete: true,
      });

      Alert.alert('Sucesso', 'Perfil completado com sucesso!');
      onComplete();
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
      onRequestClose={() => {}}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Icon name="account-edit" size={48} color={colors.primary} />
            <Text style={styles.title}>Complete seu Perfil</Text>
            <Text style={styles.subtitle}>
              Adicione seus dados para começar a usar o app
            </Text>
          </View>

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
              <Text style={styles.helpText}>
                Sua chave PIX para receber pagamentos
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF (opcional)</Text>
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
              <Text style={styles.label}>CNPJ (opcional)</Text>
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
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Começar a Usar</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    fontFamily: 'Inter-Bold',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  scrollContent: {
    maxHeight: 400,
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
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontFamily: 'Inter-Regular',
  },
});
