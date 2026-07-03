import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function OtpScreen() {
  const { verifyOtp, resendOtp, pendingPhone } = useApp();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    if (otp.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer le code à 6 chiffres.');
      return;
    }
    setLoading(true);
    const result = await verifyOtp(otp);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Erreur', result.message ?? 'Code incorrect.');
    }
  };

  const handleResend = async () => {
    const result = await resendOtp();
    if (result.success) {
      Alert.alert('SMS', 'Un nouveau code a été envoyé.');
    } else {
      Alert.alert('Erreur', result.message ?? 'Impossible de renvoyer le SMS.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification SMS</Text>
      <Text style={styles.subtitle}>
        Entrez le code à 6 chiffres envoyé au {pendingPhone ?? 'votre téléphone'}.
      </Text>

      <View style={styles.otpRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={(v) => handleChange(v, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <Button title="Vérifier" onPress={handleVerify} loading={loading} />

      <Text style={styles.hint}>
        SMS Android nécessite un build natif : npx expo prebuild && npx expo run:android
      </Text>

      <Text style={styles.resend} onPress={handleResend}>
        Renvoyer le code
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FDFA',
  },
  hint: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: Spacing.md,
    lineHeight: 18,
  },
  resend: {
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
});
