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
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { clientsService } from '../services/clientsService';
import { spacing, typography, borderRadius } from '../constants/theme';

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

export default function AddClientModal({
  visible,
  onClose,
  onClientAdded,
}: AddClientModalProps) {
  const theme = useTheme();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [installments, setInstallments] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome do cliente é obrigatório');
      return;
    }
    if (!whatsapp.trim()) {
      Alert.alert('Erro', 'WhatsApp é obrigatório');
      return;
    }
    if (!value.trim() || isNaN(Number(value))) {
      Alert.alert('Erro', 'Valor deve ser um número válido');
      return;
    }
    if (!dueDate.trim()) {
      Alert.alert('Erro', 'Data da primeira cobrança é obrigatória');
      return;
    }
    const numInstallments = Number(installments);
    if (
      !installments.trim() ||
      isNaN(numInstallments) ||
      numInstallments < 1 ||
      numInstallments > 60
    ) {
      Alert.alert('Erro', 'Parcelas deve ser um número entre 1 e 60');
      return;
    }

    try {
      await clientsService.addClient(user!.uid, {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: whatsapp.trim(),
        status: 'active',
        totalPaid: 0,
      });
      // Aqui poderia salvar as cobranças também, mas por enquanto só cliente
      Alert.alert('Sucesso', 'Cliente adicionado com sucesso!');
      resetForm();
      onClientAdded();
      onClose();
    } catch (error) {
      console.error('Error adding client:', error);
      Alert.alert('Erro', 'Falha ao adicionar cliente');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setWhatsapp('');
    setValue('');
    setDueDate('');
    setInstallments('');
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      width: '90%',
      maxHeight: '80%',
    },
    title: {
      ...typography.h2,
      color: theme.colors.onSurface,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    input: {
      backgroundColor: theme.colors.background,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      fontSize: 16,
      color: theme.colors.onSurface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    button: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginHorizontal: spacing.sm,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButton: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    cancelText: {
      color: theme.colors.onSurfaceVariant,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.title}>Adicionar Cliente</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do Cliente"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />

          <TextInput
            style={styles.input}
            placeholder="Email (opcional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />

          <TextInput
            style={styles.input}
            placeholder="WhatsApp"
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />

          <TextInput
            style={styles.input}
            placeholder="Valor da Cobrança (R$)"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />

          <TextInput
            style={styles.input}
            placeholder="Data da Primeira Cobrança (DD/MM/YYYY)"
            value={dueDate}
            onChangeText={setDueDate}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />

          <TextInput
            style={styles.input}
            placeholder="Número de Parcelas (1-60)"
            value={installments}
            onChangeText={setInstallments}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />

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
        </ScrollView>
      </View>
    </Modal>
  );
}
