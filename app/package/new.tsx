import { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing } from '@/constants/theme';

export default function NewPackageScreen() {
  const { declarePackage } = useApp();
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [description, setDescription] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [estimatedWeight, setEstimatedWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      Alert.alert('Photo ajoutée', 'La facture a été attachée au colis.');
    }
  };

  const handleSubmit = async () => {
    if (!storeName || !trackingNumber || !description) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires.');
      return;
    }
    setLoading(true);
    await declarePackage({
      storeName,
      trackingNumber,
      description,
      declaredValue: parseFloat(declaredValue) || 0,
      estimatedWeight: parseFloat(estimatedWeight) || 1,
    });
    setLoading(false);
    Alert.alert('Colis déclaré', 'Votre colis a été enregistré. Nous vous notifierons à sa réception.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input
        label="Nom du magasin *"
        placeholder="Amazon.ca, Walmart, eBay..."
        value={storeName}
        onChangeText={setStoreName}
      />
      <Input
        label="Numéro de suivi du vendeur *"
        placeholder="TBA123456789"
        value={trackingNumber}
        onChangeText={setTrackingNumber}
        autoCapitalize="characters"
      />
      <Input
        label="Description du colis *"
        placeholder="Ex: Écouteurs Bluetooth, vêtements..."
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />
      <Input
        label="Valeur déclarée (CAD)"
        placeholder="89.99"
        value={declaredValue}
        onChangeText={setDeclaredValue}
        keyboardType="decimal-pad"
      />
      <Input
        label="Poids estimé (kg)"
        placeholder="1.5"
        value={estimatedWeight}
        onChangeText={setEstimatedWeight}
        keyboardType="decimal-pad"
      />

      <Button title="Ajouter une photo de facture" onPress={pickImage} variant="outline" />

      <Button title="Déclarer le colis" onPress={handleSubmit} loading={loading} style={styles.submit} />
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
  submit: {
    marginTop: Spacing.md,
  },
});
