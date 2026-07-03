import { View, Text, StyleSheet } from 'react-native';
import { PackageStatus, STATUS_LABELS } from '@/types';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

const STATUS_COLORS: Record<PackageStatus, { bg: string; text: string }> = {
  declared: { bg: Colors.infoLight, text: Colors.info },
  received: { bg: Colors.successLight, text: Colors.success },
  preparing: { bg: Colors.warningLight, text: Colors.warning },
  shipped: { bg: '#E0E7FF', text: '#4338CA' },
  in_country: { bg: '#F3E8FF', text: '#7C3AED' },
  out_for_delivery: { bg: Colors.warningLight, text: Colors.warning },
  delivered: { bg: Colors.successLight, text: Colors.success },
};

interface StatusBadgeProps {
  status: PackageStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
