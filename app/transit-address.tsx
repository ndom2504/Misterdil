import { ScrollView, StyleSheet } from 'react-native';
import { TransitAddressCard } from '@/components/TransitAddressCard';
import { Colors, Spacing } from '@/constants/theme';

export default function TransitAddressScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TransitAddressCard />
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
  },
});
