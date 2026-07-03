import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Package } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { formatCurrency, formatDate } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/package/${pkg.id}`)}>
      <View style={styles.header}>
        <View style={styles.storeIcon}>
          <Ionicons name="cube-outline" size={22} color={Colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.storeName}>{pkg.storeName}</Text>
          <Text style={styles.tracking} numberOfLines={1}>
            {pkg.trackingNumber}
          </Text>
        </View>
        <StatusBadge status={pkg.status} />
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {pkg.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          {pkg.actualWeight ?? pkg.estimatedWeight} kg · {formatCurrency(pkg.declaredValue)}
        </Text>
        <Text style={styles.date}>{formatDate(pkg.receivedAt ?? pkg.declaredAt)}</Text>
      </View>

      {pkg.paymentStatus === 'pending' && pkg.fees && (
        <View style={styles.paymentBanner}>
          <Ionicons name="card-outline" size={16} color={Colors.warning} />
          <Text style={styles.paymentText}>
            Paiement requis : {formatCurrency(pkg.fees.total)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  storeIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  headerText: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  tracking: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  paymentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.sm,
  },
  paymentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.warning,
  },
});
