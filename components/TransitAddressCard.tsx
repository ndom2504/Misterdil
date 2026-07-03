import { View, Text, Pressable, StyleSheet, Share, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { useApp } from '@/context/AppContext';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { formatTransitAddress } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

export function TransitAddressCard() {
  const { transitAddress } = useApp();

  if (!transitAddress) return null;

  const addressText = formatTransitAddress(transitAddress);

  const copyAddress = async () => {
    await Clipboard.setStringAsync(addressText);
    Alert.alert('Copié', 'Adresse copiée dans le presse-papier.');
  };

  const shareAddress = async () => {
    try {
      await Share.share({ message: addressText, title: 'Mon adresse Misterdil' });
    } catch {
      // cancelled
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.flagRow}>
          <Text style={styles.flag}>🇨🇦</Text>
          <Text style={styles.title}>Adresse de transit au Canada</Text>
        </View>
        <Text style={styles.subtitle}>Utilisez cette adresse pour vos achats en ligne</Text>
      </View>

      <View style={styles.addressBlock}>
        <Text style={styles.warehouse}>{transitAddress.warehouseName}</Text>
        <Text style={styles.line}>Nom du client : {transitAddress.clientName}</Text>
        <Text style={styles.clientId}>ID Client : {transitAddress.clientId}</Text>
        <Text style={styles.line}>{transitAddress.street}</Text>
        <Text style={styles.line}>
          {transitAddress.city}, {transitAddress.province} {transitAddress.postalCode}
        </Text>
        <Text style={styles.line}>{transitAddress.country}</Text>
      </View>

      <View style={styles.qrContainer}>
        <QRCode value={addressText} size={120} color={Colors.text} backgroundColor="#fff" />
        <Text style={styles.qrHint}>Scannez pour copier l'adresse</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={copyAddress}>
          <Ionicons name="copy-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Copier</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={shareAddress}>
          <Ionicons name="share-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Partager</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    marginBottom: Spacing.md,
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  flag: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  addressBlock: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  warehouse: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  clientId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
    marginBottom: Spacing.xs,
  },
  line: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  qrHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    backgroundColor: '#F0FDFA',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
