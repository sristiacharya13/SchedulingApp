import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const LoginScreen = () => {
  const [mode, setMode] = useState('signIn'); // 'signIn' | 'signUp'
  const isSignUp = mode === 'signUp';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, signUp } = useAuth();
  const FULL_NAME_MAX = 48;

  useEffect(() => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  const normalizeEmail = (value) => value.trim().toLowerCase();

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
      if (!fullName.trim()) {
        Alert.alert('Missing information', 'Please enter your full name.');
        return;
      }
      if (fullName.trim().length > FULL_NAME_MAX) {
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
      signUp({ email: normalizedEmail, name: fullName.trim() });
      return;
    }

    // Mocking a successful login: use stored name (from sign-up) or derive from email
    login({ email: normalizedEmail });
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.authCard}>
          <View style={styles.segmented}>
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
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Full name</Text>
                <Text style={styles.hint}>
                  {fullName.length}/{FULL_NAME_MAX}
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={theme.colors.textMuted}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                returnKeyType="next"
                maxLength={FULL_NAME_MAX}
              />
              {fullName.length >= FULL_NAME_MAX && (
                <Text style={styles.inlineError}>Full name has reached the maximum length.</Text>
              )}
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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
            </View>
          </View>

          {isSignUp && (
            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
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
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.92}>
            <Text style={styles.buttonText}>{isSignUp ? 'Create account' : 'Sign in'}</Text>
          </TouchableOpacity>

          <Text style={styles.footerHint}>
            {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
            <Text style={styles.footerLink} onPress={() => setMode(isSignUp ? 'signIn' : 'signUp')}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.bg },
  container: { flex: 1, justifyContent: 'center', padding: theme.spacing.lg },
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
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: theme.colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
  input: {
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: '#fff',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, paddingRight: 44 },
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