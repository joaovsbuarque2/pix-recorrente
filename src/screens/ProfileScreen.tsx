import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from 'react-native-paper';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();

  const handleSignOut = async () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Erro', error.message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.displayName || 'Usuário'}</Text>
        <Text style={styles.emailHeader}>{user?.email}</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="account" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>
                {user?.displayName || 'Não informado'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="identifier" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ID do Usuário</Text>
              <Text style={styles.infoValue}>{user?.uid}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações</Text>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="cog" size={24} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Configurações</Text>
            <Text style={styles.actionSubtitle}>
              Personalize sua experiência
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="help-circle" size={24} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Ajuda</Text>
            <Text style={styles.actionSubtitle}>
              Central de ajuda e suporte
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="information" size={24} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Sobre</Text>
            <Text style={styles.actionSubtitle}>Versão do aplicativo</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={toggleTheme}>
          <Icon
            name={mode === 'dark' ? 'weather-sunny' : 'weather-night'}
            size={24}
            color={colors.primary}
          />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Tema</Text>
            <Text style={styles.actionSubtitle}>
              {mode === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Icon name="logout" size={20} color="#ffffff" />
          <Text style={styles.signOutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl * 1.5,
    paddingBottom: spacing.xxl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
  },
  name: {
    ...typography.h2,
    color: '#ffffff',
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  email: {
    ...typography.body,
    color: colors.textSecondaryDark,
  },
  emailHeader: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  infoValue: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
    fontFamily: 'Inter-SemiBold',
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontFamily: 'Inter-Regular',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
