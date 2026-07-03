import { View, Text, StyleSheet } from 'react-native';
import { PackageStatus, TRACKING_STEPS, STATUS_LABELS } from '@/types';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface TrackingTimelineProps {
  currentStatus: PackageStatus;
}

function getStepIndex(status: PackageStatus): number {
  if (status === 'declared') return -1;
  return TRACKING_STEPS.indexOf(status);
}

export function TrackingTimeline({ currentStatus }: TrackingTimelineProps) {
  const currentIndex = getStepIndex(currentStatus);

  return (
    <View style={styles.container}>
      {TRACKING_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <View key={step} style={styles.step}>
            <View style={styles.leftColumn}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isCurrent && styles.circleCurrent,
                ]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <View style={styles.dot} />
                )}
              </View>
              {index < TRACKING_STEPS.length - 1 && (
                <View style={[styles.line, isCompleted && index < currentIndex && styles.lineCompleted]} />
              )}
            </View>
            <View style={styles.content}>
              <Text style={[styles.label, isCompleted && styles.labelCompleted]}>
                {STATUS_LABELS[step]}
              </Text>
              {isCurrent && <Text style={styles.currentBadge}>Étape actuelle</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  step: {
    flexDirection: 'row',
    minHeight: 56,
  },
  leftColumn: {
    alignItems: 'center',
    width: 32,
    marginRight: Spacing.md,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    backgroundColor: Colors.success,
  },
  circleCurrent: {
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: '#99F6E4',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: Colors.success,
  },
  content: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  label: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  labelCompleted: {
    color: Colors.text,
    fontWeight: '600',
  },
  currentBadge: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
});
