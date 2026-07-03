import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { formatCurrency, formatDate } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { packages } = useApp();
  const router = useRouter();
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Colis introuvable</Text>
      </View>
    );
  }

  const canChooseDelivery = pkg.status === 'received' && !pkg.deliveryOption;
  const canPay = pkg.fees && pkg.paymentStatus === 'pending' && pkg.deliveryOption;
  const canTrack = ['preparing', 'shipped', 'in_country', 'out_for_delivery', 'delivered'].includes(
    pkg.status
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.store}>{pkg.storeName}</Text>
          <Text style={styles.tracking}>{pkg.trackingNumber}</Text>
        </View>
        <StatusBadge status={pkg.status} />
      </View>

      <Text style={styles.description}>{pkg.description}</Text>

      <View style={styles.infoGrid}>
        <InfoItem label="Valeur" value={formatCurrency(pkg.declaredValue)} />
        <InfoItem
          label="Poids"
          value={`${pkg.actualWeight ?? pkg.estimatedWeight} kg`}
        />
        {pkg.dimensions && <InfoItem label="Dimensions" value={pkg.dimensions} />}
        {pkg.condition && <InfoItem label="État" value={pkg.condition} />}
        {pkg.receivedAt && (
          <InfoItem label="Reçu le" value={formatDate(pkg.receivedAt)} />
        )}
      </View>

      {pkg.status !== 'declared' && (
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Photos du colis</Text>
          <View style={styles.photoRow}>
            {(['box', 'label', 'content'] as const).map((type) => {
              const labels = { box: 'Carton', label: 'Étiquette', content: 'Contenu' };
              const hasPhoto = pkg.photos[type];
              return (
                <View key={type} style={[styles.photoPlaceholder, hasPhoto && styles.photoFilled]}>
                  <Ionicons
                    name={hasPhoto ? 'image' : 'camera-outline'}
                    size={24}
                    color={hasPhoto ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={styles.photoLabel}>{labels[type]}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {pkg.status === 'received' && (
        <View style={styles.arrivalBanner}>
          <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
          <Text style={styles.arrivalText}>
            Votre colis est arrivé au centre Misterdil Canada.
          </Text>
        </View>
      )}

      {pkg.fees && <FeeBreakdown fees={pkg.fees} />}

      {pkg.deliveryAddress && (
        <View style={styles.deliveryCard}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <Text style={styles.deliveryType}>
            {pkg.deliveryOption === 'home' ? '🏠 Domicile' : '📍 Point de retrait'}
          </Text>
          <Text style={styles.deliveryAddress}>
            {pkg.deliveryAddress.address}, {pkg.deliveryAddress.city}
          </Text>
          <Text style={styles.deliveryAddress}>{pkg.deliveryAddress.country}</Text>
          <Text style={styles.deliveryPhone}>{pkg.deliveryAddress.phone}</Text>
        </View>
      )}

      <View style={styles.actions}>
        {canChooseDelivery && (
          <Button
            title="Choisir la livraison"
            onPress={() => router.push(`/delivery/${pkg.id}`)}
          />
        )}
        {canPay && (
          <Button
            title={`Payer ${formatCurrency(pkg.fees!.total)}`}
            onPress={() => router.push(`/payment/${pkg.id}`)}
            variant="secondary"
          />
        )}
        {canTrack && (
          <Button
            title="Suivre le colis"
            onPress={() => router.push(`/tracking/${pkg.id}`)}
            variant="outline"
          />
        )}
      </View>
    </ScrollView>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  },
  notFoundText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  store: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  tracking: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  infoItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minWidth: '47%',
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  photosSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  photoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoPlaceholder: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photoFilled: {
    borderStyle: 'solid',
    borderColor: Colors.primary + '50',
    backgroundColor: '#F0FDFA',
  },
  photoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  arrivalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.successLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  arrivalText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  deliveryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deliveryType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  deliveryAddress: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  deliveryPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
