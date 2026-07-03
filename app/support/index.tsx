import { ScrollView, View, Text, StyleSheet, Pressable, Alert, Linking } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SupportScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqItems = [
    {
      q: 'Combien de temps dure le stockage gratuit ?',
      a: '30 jours gratuits, puis 2 $ par jour supplémentaire.',
    },
    {
      q: 'Puis-je regrouper plusieurs colis ?',
      a: 'Oui, le service Premium de regroupement réduit vos frais d\'expédition.',
    },
    {
      q: 'Quels pays sont desservis ?',
      a: 'Misterdil expédie vers le Cameroun, la Côte d\'Ivoire, le Sénégal, la France, les USA et plus.',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        style={styles.chatCard}
        onPress={() => Alert.alert('Chat', 'Le chat en direct sera disponible prochainement.')}>
        <Ionicons name="chatbubbles-outline" size={28} color={Colors.primary} />
        <View style={styles.chatContent}>
          <Text style={styles.chatTitle}>Chat avec le support</Text>
          <Text style={styles.chatSub}>Réponse sous 24h</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </Pressable>

      <Pressable
        style={[styles.chatCard, styles.whatsappCard]}
        onPress={() => Linking.openURL('https://wa.me/15145550123?text=Bonjour%20Misterdil')}>
        <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
        <View style={styles.chatContent}>
          <Text style={styles.chatTitle}>WhatsApp</Text>
          <Text style={styles.chatSub}>Assistance rapide</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </Pressable>

      <Text style={styles.sectionTitle}>Centre d'aide</Text>
      {faqItems.map((item) => (
        <Pressable
          key={item.q}
          style={styles.faqItem}
          onPress={() => Alert.alert(item.q, item.a)}>
          <Text style={styles.faqQ}>{item.q}</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
        </Pressable>
      ))}

      <Text style={styles.sectionTitle}>Créer un ticket</Text>
      <View style={styles.ticketForm}>
        <Input label="Sujet" value={subject} onChangeText={setSubject} placeholder="Problème avec mon colis" />
        <Input
          label="Message"
          value={message}
          onChangeText={setMessage}
          placeholder="Décrivez votre problème..."
          multiline
          style={{ minHeight: 100, textAlignVertical: 'top' }}
        />
        <Button
          title="Envoyer le ticket"
          onPress={() => {
            Alert.alert('Ticket créé', 'Notre équipe vous répondra sous 24h.');
            setSubject('');
            setMessage('');
          }}
        />
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
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  whatsappCard: {
    marginBottom: Spacing.lg,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  chatSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  ticketForm: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
