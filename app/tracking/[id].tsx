import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { TrackingTimeline } from '@/components/TrackingTimeline';
import { StatusBadge } from '@/components/StatusBadge';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { packages } = useApp();
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Colis introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.store}>{pkg.storeName}</Text>
          <Text style={styles.tracking}>{pkg.trackingNumber}</Text>
        </View>
        <StatusBadge status={pkg.status} />
      </View>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={48} color={Colors.primary} />
        <Text style={styles.mapText}>Carte de suivi</Text>
        <Text style={styles.mapSub}>
          {pkg.status === 'delivered'
            ? 'Colis livré avec succès'
            : 'Géolocalisation disponible en production'}
        </Text>
      </View>

      <View style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Étapes de livraison</Text>
        <TrackingTimeline currentStatus={pkg.status} />
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
    gap: Spacing.md,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: Colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  store: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  tracking: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  mapPlaceholder: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 180,
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  mapSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
});
