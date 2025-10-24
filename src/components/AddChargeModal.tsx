import React, { useState, useEffect, useCallback } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import QRCode from 'react-native-qrcode-svg';
import { addMonths, parse, format } from 'date-fns';
import { useTheme } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { chargesService, Charge } from '../services/chargesService';
import { clientsService, Client } from '../services/clientsService';
import { spacing, typography, borderRadius } from '../constants/theme';

interface AddChargeModalProps {
  visible: boolean;
  onClose: () => void;
  onChargeAdded: () => void;
}

export default function AddChargeModal({
  visible,
  onClose,
  onChargeAdded,
}: AddChargeModalProps) {
  const theme = useTheme();
  const { user } = useAuthStore();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [installments, setInstallments] = useState('');
  const [savedCharge, setSavedCharge] = useState<Charge | null>(null);

  const loadClientsCallback = useCallback(async () => {
    try {
      const fetchedClients = await clientsService.getClients(user!.uid);
      setClients(fetchedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      Alert.alert('Erro', 'Falha ao carregar clientes');
    }
  }, [user?.uid]);

  useEffect(() => {
    if (visible && user?.uid) {
      loadClientsCallback();
    }
  }, [visible, user?.uid, loadClientsCallback]);

  const handleSave = async () => {
    if (!selectedClientId) {
      Alert.alert('Erro', 'Selecione um cliente');
      return;
    }
    if (!value.trim() || isNaN(Number(value))) {
      Alert.alert('Erro', 'Valor deve ser um número válido');
      return;
    }
    if (!dueDate.trim()) {
      Alert.alert('Erro', 'Data de vencimento é obrigatória');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Erro', 'Descrição é obrigatória');
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

    const selectedClient = clients.find(c => c.id === selectedClientId);
    if (!selectedClient) {
      Alert.alert('Erro', 'Cliente não encontrado');
      return;
    }

    try {
      const allCharges = await chargesService.getCharges(user!.uid);
      const existingPending = allCharges.filter(
        c => c.clientId === selectedClientId && c.status === 'pending',
      );
      if (existingPending.length > 0) {
        Alert.alert(
          'Atenção',
          'Este cliente já possui cobranças pendentes. Deseja adicionar uma nova cobrança mesmo assim?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sim',
              onPress: () => proceedToSave(numInstallments, selectedClient),
            },
          ],
        );
        return;
      }
      proceedToSave(numInstallments, selectedClient);
    } catch (error) {
      console.error('Error checking existing charges:', error);
      Alert.alert('Erro', 'Falha ao verificar cobranças existentes');
    }
  };

  const proceedToSave = async (
    numInstallments: number,
    selectedClient: Client,
  ) => {
    try {
      const baseDate = parse(dueDate, 'dd/MM/yyyy', new Date());
      let firstCharge: Charge | null = null;
      for (let i = 0; i < numInstallments; i++) {
        const currentDueDate = format(addMonths(baseDate, i), 'dd/MM/yyyy');
        const chargeId = await chargesService.addCharge(user!.uid, {
          clientName: selectedClient.name,
          clientId: selectedClientId,
          value: Number(value),
          status: 'pending',
          dueDate: currentDueDate,
          description:
            description.trim() +
            (numInstallments > 1 ? ` (${i + 1}/${numInstallments})` : ''),
        });
        if (i === 0) {
          firstCharge = {
            id: chargeId,
            clientName: selectedClient.name,
            clientId: selectedClientId,
            value: Number(value),
            status: 'pending',
            dueDate: currentDueDate,
            description:
              description.trim() +
              (numInstallments > 1 ? ` (1/${numInstallments})` : ''),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
      }
      if (numInstallments === 1 && firstCharge) {
        setSavedCharge(firstCharge);
      } else {
        Alert.alert(
          'Sucesso',
          `${numInstallments} cobrança(s) adicionada(s) com sucesso!`,
        );
        resetForm();
        onChargeAdded();
        onClose();
      }
    } catch (error) {
      console.error('Error adding charges:', error);
      Alert.alert('Erro', 'Falha ao adicionar cobrança(s)');
    }
  };

  const resetForm = () => {
    setSelectedClientId('');
    setValue('');
    setDueDate('');
    setDescription('');
    setInstallments('');
    setSavedCharge(null);
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
    picker: {
      backgroundColor: theme.colors.background,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
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
    chargeDetail: {
      fontSize: 16,
      color: theme.colors.onSurface,
      marginBottom: spacing.sm,
      fontFamily: 'Inter-Regular',
    },
    qrContainer: {
      alignItems: 'center',
      marginVertical: spacing.lg,
    },
  });

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const generatePixQrValue = () => {
    if (!savedCharge || !selectedClient) return '';
    // Simple PIX format: pix:{phone}?value={value}&description={description}
    return `pix:${selectedClient.phone}?value=${savedCharge.value}&description=${savedCharge.description}`;
  };

  const handleSendPix = () => {
    if (!savedCharge || !selectedClient) return;
    const message = `Olá ${
      savedCharge.clientName
    }, aqui está o link para pagamento da cobrança: R$ ${savedCharge.value.toFixed(
      2,
    )} - ${savedCharge.description}. Link: ${generatePixQrValue()}`;
    const url = `whatsapp://send?phone=${
      selectedClient.phone
    }&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Erro', 'WhatsApp não instalado'),
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.title}>
            {savedCharge ? 'Cobrança Criada' : 'Adicionar Cobrança'}
          </Text>

          {savedCharge ? (
            <>
              <Text style={styles.chargeDetail}>
                Cliente: {savedCharge.clientName}
              </Text>
              <Text style={styles.chargeDetail}>
                Valor: R$ {savedCharge.value.toFixed(2)}
              </Text>
              <Text style={styles.chargeDetail}>
                Descrição: {savedCharge.description}
              </Text>
              <Text style={styles.chargeDetail}>
                Vencimento: {savedCharge.dueDate}
              </Text>

              <View style={styles.qrContainer}>
                <QRCode value={generatePixQrValue()} size={150} />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleSendPix}
                >
                  <Text style={[styles.buttonText, styles.cancelText]}>
                    Enviar via WhatsApp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Picker
                selectedValue={selectedClientId}
                onValueChange={itemValue => setSelectedClientId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um cliente" value="" />
                {clients.map(client => (
                  <Picker.Item
                    key={client.id}
                    label={client.name}
                    value={client.id}
                  />
                ))}
              </Picker>

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
                placeholder="Data de Vencimento (DD/MM/YYYY)"
                value={dueDate}
                onChangeText={setDueDate}
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />

              <TextInput
                style={styles.input}
                placeholder="Descrição da Cobrança"
                value={description}
                onChangeText={setDescription}
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
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
