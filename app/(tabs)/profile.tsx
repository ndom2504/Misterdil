import { ScrollView, View, Text, StyleSheet, Pressable, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'location-outline' as const,
      label: 'Adresse de transit Canada',
      onPress: () => router.push('/transit-address'),
    },
    {
      icon: 'home-outline' as const,
      label: 'Adresses de livraison',
      onPress: () => Alert.alert('Adresses', 'Gestion des adresses à venir.'),
    },
    {
      icon: 'card-outline' as const,
      label: 'Moyens de paiement',
      onPress: () => router.push('/(tabs)/payments'),
    },
    {
      icon: 'people-outline' as const,
      label: 'Programme de parrainage',
      onPress: () =>
        Alert.alert('Parrainage', 'Invitez un ami et recevez un crédit de livraison !'),
    },
    {
      icon: 'star-outline' as const,
      label: `Fidélité · ${user?.loyaltyPoints ?? 0} points`,
      onPress: () => Alert.alert('Fidélité', '100 points = réduction sur la prochaine expédition.'),
    },
    {
      icon: 'help-circle-outline' as const,
      label: 'Assistance & Support',
      onPress: () => router.push('/support'),
    },
    {
      icon: 'logo-whatsapp' as const,
      label: 'WhatsApp Support',
      onPress: () => Linking.openURL('https://wa.me/15145550123'),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </Text>
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.clientId}>{user?.clientId}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
      </View>

      <View style={styles.premiumBanner}>
        <Ionicons name="diamond-outline" size={24} color={Colors.primary} />
        <View style={styles.premiumContent}>
          <Text style={styles.premiumTitle}>Services Premium</Text>
          <Text style={styles.premiumSub}>
            Regroupement · Suppression emballages · Assurance · 30j stockage gratuit
          </Text>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={item.onPress}>
            <Ionicons name={item.icon} size={22} color={Colors.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Button title="Se déconnecter" onPress={handleLogout} variant="outline" style={styles.logoutBtn} />
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
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  clientId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  phone: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  premiumSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  menuItemPressed: {
    backgroundColor: Colors.background,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  logoutBtn: {
    borderColor: Colors.error,
  },
});
