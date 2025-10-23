import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');
const chartWidth = width - spacing.lg * 2;

// Mock data for charts
const revenueData = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [
    {
      data: [120, 180, 150, 220, 280, 190, 240],
    },
  ],
};

const chargesStatusData = [
  {
    name: 'Pagas',
    value: 16,
    color: '#10b981',
    legendFontColor: colors.textDark,
    legendFontSize: 14,
  },
  {
    name: 'Pendentes',
    value: 8,
    color: '#f59e0b',
    legendFontColor: colors.textDark,
    legendFontSize: 14,
  },
  {
    name: 'Vencidas',
    value: 3,
    color: '#ef4444',
    legendFontColor: colors.textDark,
    legendFontSize: 14,
  },
];

const monthlyRevenueData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      data: [4200, 3800, 5100, 4800, 6200, 6240],
    },
  ],
};

const chartConfig = {
  backgroundColor: colors.backgroundDark,
  backgroundGradientFrom: colors.backgroundDark,
  backgroundGradientTo: colors.backgroundDark,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#3b82f6',
  },
};

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Visão geral dos seus recebimentos</Text>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.cardGreen]}>
          <Text style={styles.cardLabel}>Receita Semanal</Text>
          <Text style={styles.cardValue}>R$ 1.490,00</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </View>

        <View style={[styles.card, styles.cardBlue]}>
          <Text style={styles.cardLabel}>Receita Mensal</Text>
          <Text style={styles.cardValue}>R$ 6.240,00</Text>
          <Text style={styles.cardChange}>+8% vs mês anterior</Text>
        </View>
      </View>

      {/* Revenue Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Receita dos Últimos 7 Dias</Text>
        <LineChart
          data={revenueData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCardPurple]}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Clientes Ativos</Text>
        </View>

        <View style={[styles.statCard, styles.statCardYellow]}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Cobranças Pendentes</Text>
        </View>

        <View style={[styles.statCard, styles.statCardGreen]}>
          <Text style={styles.statNumber}>16</Text>
          <Text style={styles.statLabel}>Cobranças Pagas</Text>
        </View>

        <View style={[styles.statCard, styles.statCardPink]}>
          <Text style={styles.statNumber}>R$ 12.450</Text>
          <Text style={styles.statLabel}>Total Recebido</Text>
        </View>
      </View>

      {/* Charges Status Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Status das Cobranças</Text>
        <PieChart
          data={chargesStatusData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Monthly Revenue Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Receita Mensal (Últimos 6 Meses)</Text>
        <BarChart
          data={monthlyRevenueData}
          width={chartWidth}
          height={220}
          yAxisLabel="R$ "
          yAxisSuffix=""
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          }}
          style={styles.chart}
          showValuesOnTopOfBars
        />
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
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  card: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Medium',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Bold',
  },
  cardChange: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.8,
    fontFamily: 'Inter-Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  cardGreen: {
    backgroundColor: '#10b981',
  },
  cardBlue: {
    backgroundColor: '#3b82f6',
  },
  statCardPurple: {
    backgroundColor: '#8b5cf6',
  },
  statCardYellow: {
    backgroundColor: '#f59e0b',
  },
  statCardGreen: {
    backgroundColor: '#10b981',
  },
  statCardPink: {
    backgroundColor: '#ec4899',
  },
  chartContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  chartTitle: {
    ...typography.h2,
    color: colors.textDark,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  chart: {
    borderRadius: borderRadius.lg,
    marginVertical: spacing.md,
  },
});
