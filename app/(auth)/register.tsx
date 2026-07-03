import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function RegisterScreen() {
  const { register } = useApp();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !email || !phone || !password) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires.');
      return;
    }
    setLoading(true);
    const result = await register({
      firstName,
      lastName,
      email,
      phone,
      country: country || 'Cameroun',
      password,
    });
    setLoading(false);
    if (result.success) {
      if (result.message) {
        Alert.alert('Compte créé', result.message);
      }
      router.push('/(auth)/otp');
    } else {
      Alert.alert('Erreur', result.message ?? 'Inscription échouée.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>
          Recevez votre adresse de transit au Canada et expédiez vos colis partout dans le monde.
        </Text>

        <View style={styles.form}>
          <Input label="Prénom *" value={firstName} onChangeText={setFirstName} placeholder="John" />
          <Input label="Nom" value={lastName} onChangeText={setLastName} placeholder="Doe" />
          <Input
            label="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="votre@email.com"
          />
          <Input
            label="Téléphone *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+237 6XX XXX XXX"
          />
          <Input
            label="Pays de destination"
            value={country}
            onChangeText={setCountry}
            placeholder="Cameroun"
          />
          <Input
            label="Mot de passe *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Minimum 6 caractères"
          />

          <Button title="Continuer" onPress={handleRegister} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.link}>Se connecter</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xl * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  link: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
