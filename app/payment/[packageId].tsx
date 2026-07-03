import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { Button } from '@/components/ui/Button';
import { PaymentMethod } from '@/types';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

const METHODS: { key: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'card', label: 'Carte bancaire', icon: 'card-outline' },
  { key: 'apple_pay', label: 'Apple Pay', icon: 'logo-apple' },
  { key: 'google_pay', label: 'Google Pay', icon: 'logo-google' },
  { key: 'interac', label: 'Interac', icon: 'swap-horizontal-outline' },
  { key: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
  { key: 'mobile_money', label: 'Mobile Money', icon: 'phone-portrait-outline' },
];

export default function PaymentScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const { packages, payForPackage } = useApp();
  const router = useRouter();
  const pkg = packages.find((p) => p.id === packageId);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);

  if (!pkg?.fees) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Aucun paiement requis pour ce colis.</Text>
      </View>
    );
  }

  const handlePay = async () => {
    setLoading(true);
    const success = await payForPackage(pkg.id, method);
    setLoading(false);
    if (success) {
      Alert.alert('Paiement confirmé', 'Votre colis sera expédié sous peu. +100 points fidélité !', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{pkg.storeName}</Text>
        <Text style={styles.summaryDesc}>{pkg.description}</Text>
        <Text style={styles.total}>{formatCurrency(pkg.fees.total)}</Text>
      </View>

      <FeeBreakdown fees={pkg.fees} />

      <Text style={styles.sectionTitle}>Moyen de paiement</Text>
      {METHODS.map((m) => (
        <Pressable
          key={m.key}
          style={[styles.methodCard, method === m.key && styles.methodSelected]}
          onPress={() => setMethod(m.key)}>
          <Ionicons
            name={m.icon}
            size={24}
            color={method === m.key ? Colors.primary : Colors.textMuted}
          />
          <Text style={[styles.methodLabel, method === m.key && styles.methodLabelSelected]}>
            {m.label}
          </Text>
          {method === m.key && (
            <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
          )}
        </Pressable>
      ))}

      <Button
        title={`Payer ${formatCurrency(pkg.fees.total)}`}
        onPress={handlePay}
        loading={loading}
        style={styles.payBtn}
      />
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
    gap: Spacing.md,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  notFoundText: {
    color: Colors.textMuted,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  total: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  methodSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FDFA',
  },
  methodLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  methodLabelSelected: {
    fontWeight: '600',
    color: Colors.primary,
  },
  payBtn: {
    marginTop: Spacing.sm,
  },
});
