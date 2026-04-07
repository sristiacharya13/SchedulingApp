import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import AnimatedPressable from '../../components/ui/AnimatedPressable';

const LoginScreen = () => {
  const scrollRef = useRef(null);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const fullNameFieldRef = useRef(null);
  const emailFieldRef = useRef(null);
  const passwordFieldRef = useRef(null);
  const confirmPasswordFieldRef = useRef(null);

  const [mode, setMode] = useState('signIn'); // 'signIn' | 'signUp'
  const isSignUp = mode === 'signUp';
  const toggleAnim = useRef(new Animated.Value(0)).current;
  const [toggleWidth, setToggleWidth] = useState(0);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, signUp } = useAuth();
  const FULL_NAME_MAX = 48;

  const focusAnim = useRef({
    fullName: new Animated.Value(0),
    email: new Animated.Value(0),
    password: new Animated.Value(0),
    confirmPassword: new Animated.Value(0),
  }).current;

  const focusBorder = (v) =>
    v.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.borderStrong, theme.colors.primary],
    });

  const focusGlow = (v) =>
    v.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.16],
    });

  const setFocused = (key, isFocused) => {
    Animated.timing(focusAnim[key], {
      toValue: isFocused ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: isSignUp ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [isSignUp, toggleAnim]);

  useEffect(() => {
    const onShow = (e) => {
      const height = e?.endCoordinates?.height || 0;
      // Cap padding so it doesn't over-scroll on very tall keyboards / small screens
      setKeyboardPadding(Math.min(height, 340));
    };
    const onHide = () => setKeyboardPadding(0);

    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', onShow);
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', onHide);
    return () => {
      showSub?.remove?.();
      hideSub?.remove?.();
    };
  }, []);

  const scrollToField = (fieldRef) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const fieldNode = fieldRef?.current;
        const scrollNode = scrollRef?.current;
        if (!fieldNode?.measureLayout || !scrollNode) return;

        fieldNode.measureLayout(
          scrollNode,
          (_x, y) => {
            scrollNode.scrollTo?.({ y: Math.max(y - 18, 0), animated: true });
          },
          () => {}
        );
      }, 60);
    });
  };

  const normalizeEmail = (value) => value.trim().toLowerCase();

  const normalizeFullName = (value) => {
    const cleaned = (value || '')
      .replace(/\d+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return '';
    return cleaned
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const stripDigitsKeepSpacing = (value) => {
    return (value || '').replace(/\d+/g, '').replace(/\s+/g, ' ');
  };

  const isValidEmail = (value) => {
    const v = normalizeEmail(value);
    // Strict-enough for UI: no spaces, must have @, domain, and a 2+ char TLD.
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  };

  const title = useMemo(() => {
    return isSignUp ? 'Create your account' : 'Let’s get you signed in';
  }, [isSignUp]);

  const subtitle = useMemo(() => {
    return isSignUp ? 'A few details and you’re ready to book.' : 'Welcome back — pick up where you left off.';
  }, [isSignUp]);

  const handleSubmit = () => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      Alert.alert('Missing information', 'Please enter your email and password.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address (example: name@domain.com).');
      return;
    }

    if (isSignUp) {
      const normalizedName = normalizeFullName(fullName);

      if (!normalizedName) {
        Alert.alert('Missing information', 'Please enter your full name.');
        return;
      }
      if (normalizedName.length > FULL_NAME_MAX) {
        Alert.alert('Name too long', `Full name must be ${FULL_NAME_MAX} characters or fewer.`);
        return;
      }
      if (password.length < 6) {
        Alert.alert('Password too short', 'Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Passwords do not match', 'Please confirm your password.');
        return;
      }
      signUp({ email: normalizedEmail, name: normalizedName });
      return;
    }

    // Mocking a successful login: use stored name (from sign-up) or derive from email
    login({ email: normalizedEmail });
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingBottom: theme.spacing.lg + keyboardPadding }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        <View style={styles.authCard}>
          <View style={styles.segmented}>
            <View
              style={styles.segmentIndicatorTrack}
              onLayout={(e) => setToggleWidth(e?.nativeEvent?.layout?.width || 0)}
            >
              <Animated.View
                style={[
                  styles.segmentIndicator,
                  {
                    width: Math.max((toggleWidth - 8) / 2, 0),
                    transform: [
                      {
                        translateX: toggleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, Math.max((toggleWidth - 8) / 2, 0)],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              onPress={() => setMode('signIn')}
              style={[styles.segment, !isSignUp && styles.segmentActive]}
              accessibilityRole="button"
              accessibilityLabel="Sign in tab"
              activeOpacity={0.9}
            >
              <Text style={[styles.segmentText, !isSignUp && styles.segmentTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('signUp')}
              style={[styles.segment, isSignUp && styles.segmentActive]}
              accessibilityRole="button"
              accessibilityLabel="Sign up tab"
              activeOpacity={0.9}
            >
              <Text style={[styles.segmentText, isSignUp && styles.segmentTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {isSignUp && (
            <View style={styles.field} ref={fullNameFieldRef}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Full name</Text>
                <Text style={styles.hint}>
                  {fullName.length}/{FULL_NAME_MAX}
                </Text>
              </View>
              <Animated.View
                style={[
                  styles.inputWrap,
                  {
                    borderColor: focusBorder(focusAnim.fullName),
                    shadowOpacity: focusGlow(focusAnim.fullName),
                  },
                ]}
              >
              <TextInput
                style={styles.inputInner}
                placeholder="John Doe"
                placeholderTextColor={theme.colors.textMuted}
                value={fullName}
                onChangeText={(v) => setFullName(stripDigitsKeepSpacing(v))}
                autoCapitalize="words"
                returnKeyType="next"
                maxLength={FULL_NAME_MAX}
                onFocus={() => {
                  setFocused('fullName', true);
                  scrollToField(fullNameFieldRef);
                }}
                onBlur={() => {
                  setFocused('fullName', false);
                  setFullName((v) => normalizeFullName(v));
                }}
              />
              </Animated.View>
              {fullName.length >= FULL_NAME_MAX && (
                <Text style={styles.inlineError}>Full name has reached the maximum length.</Text>
              )}
            </View>
          )}

          <View style={styles.field} ref={emailFieldRef}>
            <Text style={styles.label}>Email</Text>
            <Animated.View
              style={[
                styles.inputWrap,
                {
                  borderColor: focusBorder(focusAnim.email),
                  shadowOpacity: focusGlow(focusAnim.email),
                },
              ]}
            >
            <TextInput
              style={styles.inputInner}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onFocus={() => {
                setFocused('email', true);
                scrollToField(emailFieldRef);
              }}
              onBlur={() => setFocused('email', false)}
            />
            </Animated.View>
          </View>

          <View style={styles.field} ref={passwordFieldRef}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <Animated.View
                style={[
                  styles.inputWrap,
                  styles.passwordWrap,
                  {
                    borderColor: focusBorder(focusAnim.password),
                    shadowOpacity: focusGlow(focusAnim.password),
                  },
                ]}
              >
              <TextInput
                style={[styles.inputInner, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onFocus={() => {
                  setFocused('password', true);
                  scrollToField(passwordFieldRef);
                }}
                onBlur={() => setFocused('password', false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                activeOpacity={0.7}
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

          {isSignUp && (
            <View style={styles.field} ref={confirmPasswordFieldRef}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.passwordRow}>
                <Animated.View
                  style={[
                    styles.inputWrap,
                    styles.passwordWrap,
                    {
                      borderColor: focusBorder(focusAnim.confirmPassword),
                      shadowOpacity: focusGlow(focusAnim.confirmPassword),
                    },
                  ]}
                >
                <TextInput
                  style={[styles.inputInner, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  onFocus={() => {
                    setFocused('confirmPassword', true);
                    scrollToField(confirmPasswordFieldRef);
                  }}
                  onBlur={() => setFocused('confirmPassword', false)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  style={styles.eyeBtn}
                  accessibilityRole="button"
                  accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  activeOpacity={0.7}
                >
                  <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          )}

          <AnimatedPressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isSignUp ? 'Create account' : 'Sign in'}</Text>
          </AnimatedPressable>

          <Text style={styles.footerHint}>
            {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
            <Text style={styles.footerLink} onPress={() => setMode(isSignUp ? 'signIn' : 'signUp')}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.lg },
  authCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 26, 46, 0.06)',
    borderRadius: theme.radii.pill,
    padding: 4,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  segmentIndicatorTrack: {
    ...StyleSheet.absoluteFillObject,
    padding: 4,
  },
  segmentIndicator: {
    height: '100%',
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: 'transparent',
  },
  segmentText: { ...theme.typography.h3, color: theme.colors.textMuted },
  segmentTextActive: { color: theme.colors.text },
  title: { ...theme.typography.title, color: theme.colors.text, marginBottom: 6 },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  field: { marginBottom: theme.spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label: { ...theme.typography.small, color: theme.colors.textMuted },
  hint: { ...theme.typography.small, color: theme.colors.textMuted },
  inputWrap: {
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    backgroundColor: '#fff',
    shadowColor: theme.colors.primary,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 0,
  },
  inputInner: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, paddingRight: 44 },
  passwordWrap: { flex: 1 },
  eyeBtn: {
    position: 'absolute',
    right: 10,
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonText: { ...theme.typography.h3, color: '#fff' },
  footerHint: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.textMuted,
    ...theme.typography.small,
  },
  footerLink: { color: theme.colors.primary, fontWeight: '800' },
  inlineError: { marginTop: 8, ...theme.typography.small, color: theme.colors.danger },
});

export default LoginScreen;