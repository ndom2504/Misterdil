import { FlatList, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { formatDate } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';

const TYPE_ICONS = {
  info: 'information-circle-outline' as const,
  success: 'checkmark-circle-outline' as const,
  warning: 'warning-outline' as const,
  payment: 'card-outline' as const,
};

const TYPE_COLORS = {
  info: Colors.info,
  success: Colors.success,
  warning: Colors.warning,
  payment: Colors.accent,
};

export default function NotificationsScreen() {
  const { notifications, markNotificationRead } = useApp();
  const router = useRouter();

  return (
    <FlatList
      style={styles.container}
      data={notifications}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={[styles.card, !item.read && styles.unread]}
          onPress={() => {
            markNotificationRead(item.id);
            if (item.packageId) {
              router.push(`/package/${item.packageId}`);
            }
          }}>
          <View style={[styles.iconWrap, { backgroundColor: TYPE_COLORS[item.type] + '20' }]}>
            <Ionicons name={TYPE_ICONS[item.type]} size={22} color={TYPE_COLORS[item.type]} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          </View>
          {!item.read && <View style={styles.dot} />}
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  unread: {
    borderColor: Colors.primary + '50',
    backgroundColor: '#F0FDFA',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  message: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  date: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
});
