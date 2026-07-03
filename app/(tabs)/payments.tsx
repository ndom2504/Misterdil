import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { formatCurrency, formatDate } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

const METHOD_LABELS: Record<string, string> = {
  card: 'Carte bancaire',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  interac: 'Interac',
  paypal: 'PayPal',
  mobile_money: 'Mobile Money',
};

export default function PaymentsScreen() {
  const { payments, packages, user } = useApp();

  const pendingPackages = packages.filter(
    (p) => p.paymentStatus === 'pending' && p.fees && p.status !== 'declared'
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={styles.balanceValue}>{formatCurrency(user?.balance ?? 0)}</Text>
        <Text style={styles.balanceHint}>Crédits et remboursements</Text>
      </View>

      {pendingPackages.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Paiements en attente</Text>
          {pendingPackages.map((pkg) => (
            <View key={pkg.id} style={styles.pendingCard}>
              <View style={styles.pendingHeader}>
                <Ionicons name="alert-circle" size={20} color={Colors.warning} />
                <Text style={styles.pendingTitle}>{pkg.storeName}</Text>
              </View>
              <Text style={styles.pendingAmount}>{formatCurrency(pkg.fees!.total)}</Text>
              <Text style={styles.pendingDesc}>{pkg.description}</Text>
            </View>
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>Historique des paiements</Text>
      {payments.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.emptyText}>Aucun paiement effectué</Text>
        </View>
      ) : (
        payments.map((payment) => {
          const pkg = packages.find((p) => p.id === payment.packageId);
          return (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentIcon}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{pkg?.storeName ?? 'Colis'}</Text>
                <Text style={styles.paymentMeta}>
                  {METHOD_LABELS[payment.method]} · {formatDate(payment.createdAt)}
                </Text>
              </View>
              <Text style={styles.paymentAmount}>-{formatCurrency(payment.amount)}</Text>
            </View>
          );
        })
      )}

      <View style={styles.methodsCard}>
        <Text style={styles.methodsTitle}>Moyens de paiement acceptés</Text>
        <View style={styles.methodsGrid}>
          {['Carte', 'Apple Pay', 'Google Pay', 'Interac', 'PayPal', 'Mobile Money'].map((m) => (
            <View key={m} style={styles.methodChip}>
              <Text style={styles.methodText}>{m}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginVertical: Spacing.xs,
  },
  balanceHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  pendingCard: {
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  pendingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  pendingAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.warning,
  },
  pendingDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentIcon: {
    marginRight: Spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.textMuted,
  },
  methodsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  methodsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  methodChip: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  methodText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
