import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

interface DashboardStatsProps {
  pending: number;
  inTransit: number;
  delivered: number;
  balance: number;
}

export function DashboardStats({ pending, inTransit, delivered, balance }: DashboardStatsProps) {
  const stats = [
    { label: 'En attente', value: pending, icon: 'time-outline' as const, color: Colors.warning },
    { label: 'En transit', value: inTransit, icon: 'airplane-outline' as const, color: Colors.info },
    { label: 'Livrés', value: delivered, icon: 'checkmark-circle-outline' as const, color: Colors.success },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Solde du compte</Text>
          <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
        </View>
        <View style={styles.balanceIcon}>
          <Ionicons name="wallet-outline" size={28} color={Colors.primary} />
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon} size={22} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  balanceIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
