import { View, Text, StyleSheet } from 'react-native';
import { ShippingFees } from '@/types';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/format';

interface FeeBreakdownProps {
  fees: ShippingFees;
}

export function FeeBreakdown({ fees }: FeeBreakdownProps) {
  const lines = [
    { label: 'Transport', value: fees.transport },
    { label: 'Assurance', value: fees.insurance },
    { label: 'Stockage', value: fees.storage },
    { label: 'Taxes éventuelles', value: fees.taxes },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail des frais</Text>
      {lines.map((line) => (
        <View key={line.label} style={styles.row}>
          <Text style={styles.label}>{line.label}</Text>
          <Text style={styles.value}>{formatCurrency(line.value)}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(fees.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
});
