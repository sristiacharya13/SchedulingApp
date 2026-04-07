import React, { useMemo, useRef } from 'react';
import { Animated, Platform, Pressable } from 'react-native';

const DURATION = 220;

export default function AnimatedPressable({
  children,
  style,
  pressedScale = 0.98,
  hoverScale = 1.01,
  onPress,
  disabled,
  ...rest
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const shadow = useRef(new Animated.Value(0)).current;

  const animatedStyle = useMemo(() => {
    return {
      transform: [{ scale }],
      ...(Platform.OS === 'web'
        ? {
            shadowOpacity: shadow,
          }
        : null),
    };
  }, [scale, shadow]);

  const animateTo = (toScale, toShadow) => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: toScale,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(shadow, {
        toValue: toShadow,
        duration: DURATION,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animateTo(pressedScale, 0.04)}
      onPressOut={() => animateTo(1, 0)}
      onHoverIn={() => animateTo(hoverScale, 0.08)}
      onHoverOut={() => animateTo(1, 0)}
      {...rest}
    >
      <Animated.View
        style={[
          style,
          Platform.OS === 'web'
            ? {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 18,
              }
            : null,
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

