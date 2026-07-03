import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { DeliveryOption } from '@/types';
import { calculateFees } from '@/utils/fees';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { packages, updatePackageDelivery } = useApp();
  const router = useRouter();
  const pkg = packages.find((p) => p.id === id);

  const [option, setOption] = useState<DeliveryOption>('home');
  const [country, setCountry] = useState('Cameroun');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!pkg) {
    return (
      <View style={styles.notFound}>
        <Text>Colis introuvable</Text>
      </View>
    );
  }

  const previewFees = calculateFees({
    weightKg: pkg.actualWeight ?? pkg.estimatedWeight,
    declaredValue: pkg.declaredValue,
    destinationCountry: country === 'Cameroun' ? 'CM' : 'DEFAULT',
    deliveryOption: option,
  });

  const handleConfirm = async () => {
    if (!city || !address || !phone) {
      Alert.alert('Erreur', 'Veuillez remplir l\'adresse de livraison.');
      return;
    }
    setLoading(true);
    await updatePackageDelivery(pkg.id, option, { country, city, address, phone });
    setLoading(false);
    Alert.alert('Livraison configurée', 'Les frais ont été calculés. Procédez au paiement.', [
      { text: 'Payer', onPress: () => router.replace(`/payment/${pkg.id}`) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Comment souhaitez-vous recevoir votre colis ?</Text>

      <Pressable
        style={[styles.optionCard, option === 'pickup_point' && styles.optionSelected]}
        onPress={() => setOption('pickup_point')}>
        <Ionicons
          name="location-outline"
          size={28}
          color={option === 'pickup_point' ? Colors.primary : Colors.textMuted}
        />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Point de retrait</Text>
          <Text style={styles.optionDesc}>Récupérez votre colis dans un point relais</Text>
        </View>
        {option === 'pickup_point' && (
          <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
        )}
      </Pressable>

      <Pressable
        style={[styles.optionCard, option === 'home' && styles.optionSelected]}
        onPress={() => setOption('home')}>
        <Ionicons
          name="home-outline"
          size={28}
          color={option === 'home' ? Colors.primary : Colors.textMuted}
        />
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Livraison à domicile</Text>
          <Text style={styles.optionDesc}>Livraison directement chez vous (+12 $)</Text>
        </View>
        {option === 'home' && (
          <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
        )}
      </Pressable>

      <Text style={styles.sectionTitle}>Adresse de livraison</Text>
      <Input label="Pays" value={country} onChangeText={setCountry} placeholder="Cameroun" />
      <Input label="Ville *" value={city} onChangeText={setCity} placeholder="Douala" />
      <Input
        label="Adresse *"
        value={address}
        onChangeText={setAddress}
        placeholder="Quartier, rue, numéro..."
        multiline
      />
      <Input
        label="Téléphone *"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="+237 6XX XXX XXX"
      />

      <FeeBreakdown fees={previewFees} />

      <Button title="Confirmer et calculer les frais" onPress={handleConfirm} loading={loading} />
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FDFA',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  optionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
});
