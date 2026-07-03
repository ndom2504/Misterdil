import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { estimateFromProductLink } from '@/utils/fees';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

export default function AssistantScreen() {
  const [url, setUrl] = useState('');
  const [country, setCountry] = useState('CM');
  const [result, setResult] = useState<ReturnType<typeof estimateFromProductLink> | null>(null);

  const handleEstimate = () => {
    if (!url.includes('http')) return;
    setResult(estimateFromProductLink(url, country));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Ionicons name="sparkles" size={32} color={Colors.primary} />
        <Text style={styles.heroTitle}>Assistant d'achat Misterdil</Text>
        <Text style={styles.heroSub}>
          Collez un lien produit (Amazon.ca, Walmart...) et obtenez une estimation du coût total
          jusqu'à votre pays.
        </Text>
      </View>

      <Input
        label="Lien du produit"
        value={url}
        onChangeText={setUrl}
        placeholder="https://amazon.ca/dp/..."
        autoCapitalize="none"
        keyboardType="url"
      />
      <Input
        label="Code pays destination"
        value={country}
        onChangeText={setCountry}
        placeholder="CM, FR, SN, CI..."
        autoCapitalize="characters"
      />

      <Button title="Estimer les frais" onPress={handleEstimate} />

      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Estimation</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Prix article (estimé)</Text>
            <Text style={styles.resultValue}>{formatCurrency(result.productPrice)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Poids estimé</Text>
            <Text style={styles.resultValue}>{result.estimatedWeight} kg</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Délai estimé</Text>
            <Text style={styles.resultValue}>{result.estimatedDays} jours</Text>
          </View>

          <FeeBreakdown fees={result.fees} />

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Coût total estimé</Text>
            <Text style={styles.totalValue}>{formatCurrency(result.totalCost)}</Text>
            <Text style={styles.totalHint}>Article + transport + assurance + taxes</Text>
          </View>
        </View>
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
    gap: Spacing.md,
  },
  hero: {
    backgroundColor: '#F0FDFA',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  result: {
    gap: Spacing.md,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  totalValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginVertical: Spacing.xs,
  },
  totalHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
});
