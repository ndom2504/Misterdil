import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { DashboardStats } from '@/components/DashboardStats';
import { TransitAddressCard } from '@/components/TransitAddressCard';
import { PackageCard } from '@/components/PackageCard';
import { Colors, Spacing, BorderRadius, Slogan } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user, packages, notifications } = useApp();
  const router = useRouter();

  const pending = packages.filter((p) => ['declared', 'received'].includes(p.status)).length;
  const inTransit = packages.filter((p) =>
    ['preparing', 'shipped', 'in_country', 'out_for_delivery'].includes(p.status)
  ).length;
  const delivered = packages.filter((p) => p.status === 'delivered').length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const recentPackages = packages.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.firstName} 👋</Text>
          <Text style={styles.slogan}>{Slogan}</Text>
        </View>
        <Pressable style={styles.notifBtn} onPress={() => router.push('/(tabs)/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
          {unreadNotifications > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <DashboardStats
        pending={pending}
        inTransit={inTransit}
        delivered={delivered}
        balance={user?.balance ?? 0}
      />

      <Pressable style={styles.newPackageBtn} onPress={() => router.push('/package/new')}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.newPackageText}>Déclarer un nouveau colis</Text>
      </Pressable>

      <Pressable style={styles.assistantBtn} onPress={() => router.push('/assistant')}>
        <Ionicons name="link-outline" size={20} color={Colors.primary} />
        <View style={styles.assistantContent}>
          <Text style={styles.assistantTitle}>Assistant d'achat</Text>
          <Text style={styles.assistantSub}>Collez un lien Amazon.ca pour estimer les frais</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </Pressable>

      <Text style={styles.sectionTitle}>Adresse de transit</Text>
      <TransitAddressCard />

      {recentPackages.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Colis récents</Text>
            <Pressable onPress={() => router.push('/(tabs)/packages')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </Pressable>
          </View>
          {recentPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  slogan: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  notifBtn: {
    position: 'relative',
    padding: Spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  newPackageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginVertical: Spacing.md,
  },
  newPackageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  assistantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  assistantContent: {
    flex: 1,
  },
  assistantTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  assistantSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  seeAll: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
