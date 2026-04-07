import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme/theme';

export default function Toast({ visible, message, variant = 'success' }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  const icon = useMemo(() => {
    if (variant === 'error') return { name: 'alert-circle-outline', color: theme.colors.danger };
    return { name: 'checkmark-circle-outline', color: theme.colors.success };
  }, [variant]);

  useEffect(() => {
    const toValue = visible ? 1 : 0;
    Animated.parallel([
      Animated.timing(opacity, { toValue, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: visible ? 0 : 10, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, visible]);

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.toast}>
        <Ionicons name={icon.name} size={18} color={icon.color} />
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  text: { ...theme.typography.small, color: theme.colors.text, fontWeight: '800', flex: 1 },
});

