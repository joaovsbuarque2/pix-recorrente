import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { borderRadius, colors, spacing, typography } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

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

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Visão geral dos seus recebimentos</Text>
      </View>

      <View style={styles.cardsRow}>
        <LinearGradient
          colors={['#10b981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, styles.cardGradient]}
        >
          <Text style={styles.cardLabel}>Receita Semanal</Text>
          <Text style={styles.cardValue}>R$ 1.490,00</Text>
          <Text style={styles.cardChange}>+12% vs semana anterior</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#3b82f6', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, styles.cardGradient]}
        >
          <Text style={styles.cardLabel}>Receita Mensal</Text>
          <Text style={styles.cardValue}>R$ 6.240,00</Text>
          <Text style={styles.cardChange}>+8% vs mês anterior</Text>
        </LinearGradient>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Receita dos Últimos 7 Dias</Text>
        <LineChart
          data={revenueData}
          width={screenWidth - 64}
          height={220}
          chartConfig={{
            backgroundColor: colors.surfaceDark,
            backgroundGradientFrom: colors.surfaceDark,
            backgroundGradientTo: colors.surfaceDark,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(255, 255, 255, ${opacity * 0.7})`,
            style: {
              borderRadius: borderRadius.lg,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#3b82f6',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsGrid}>
        <LinearGradient
          colors={['#8b5cf6', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, styles.statCardGradient]}
        >
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Clientes Ativos</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#f59e0b', '#d97706']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, styles.statCardGradient]}
        >
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Cobranças Pendentes</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#10b981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, styles.statCardGradient]}
        >
          <Text style={styles.statNumber}>16</Text>
          <Text style={styles.statLabel}>Cobranças Pagas</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#ec4899', '#db2777']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, styles.statCardGradient]}
        >
          <Text style={styles.statNumber}>R$ 12.450</Text>
          <Text style={styles.statLabel}>Total Recebido</Text>
        </LinearGradient>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Status das Cobranças</Text>
        <PieChart
          data={chargesStatusData}
          width={screenWidth - 64}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Receita Mensal (Últimos 6 Meses)</Text>
        <BarChart
          data={monthlyRevenueData}
          width={screenWidth - 64}
          height={220}
          yAxisLabel="R$ "
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: colors.surfaceDark,
            backgroundGradientFrom: colors.surfaceDark,
            backgroundGradientTo: colors.surfaceDark,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(255, 255, 255, ${opacity * 0.7})`,
            style: {
              borderRadius: borderRadius.lg,
            },
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
  cardGradient: {
    borderRadius: borderRadius.lg,
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
  statCardGradient: {
    borderRadius: borderRadius.lg,
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
  simpleChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingVertical: spacing.lg,
  },
  chartBar: {
    alignItems: 'center',
    width: 35,
  },
  chartBarFill: {
    width: 25,
    backgroundColor: '#3b82f6',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  chartBarFillGreen: {
    height: (6200 / 7000) * 150, // Scale based on max value
    backgroundColor: '#10b981',
  },
  chartLabel: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    fontFamily: 'Inter-Medium',
  },
  chartValue: {
    fontSize: 10,
    color: colors.textDark,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  pieChart: {
    padding: spacing.lg,
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pieColor: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  pieLabel: {
    fontSize: 14,
    color: colors.textDark,
    fontFamily: 'Inter-Medium',
  },
});
