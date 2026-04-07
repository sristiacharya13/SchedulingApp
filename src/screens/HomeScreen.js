import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { PROVIDERS } from '../utils/mockData';
import { theme } from '../theme/theme';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const displayName = user?.name?.trim?.() || 'there';

  const renderProvider = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProviderDetail', { provider: item })} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Scheduling</Text>
          <Text style={styles.welcome}>Hi {displayName},</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyAppointments')}
            style={styles.bookingsBtn}
            activeOpacity={0.9}
          >
            <Ionicons name="calendar-outline" size={16} color={theme.colors.onDark} />
            <Text style={styles.bookingsText}>My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout} style={styles.logoutBtn} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={18} color={theme.colors.onDark} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={PROVIDERS}
        keyExtractor={(item) => item.id}
        renderItem={renderProvider}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 247, 255, 0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flex: 1, paddingRight: theme.spacing.md },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  brand: { ...theme.typography.h2, color: theme.colors.onDark, marginBottom: 2 },
  welcome: { ...theme.typography.small, color: theme.colors.onDarkMuted },
  bookingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 247, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(244, 247, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radii.pill,
  },
  bookingsText: { ...theme.typography.small, color: theme.colors.onDark, fontWeight: '800' },
  logoutBtn: {
    backgroundColor: 'rgba(244, 247, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(244, 247, 255, 0.18)',
    height: 40,
    width: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { padding: theme.spacing.lg },
  card: { 
    flexDirection: 'row', 
    backgroundColor: theme.colors.card, 
    padding: theme.spacing.md, 
    borderRadius: theme.radii.lg, 
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  image: { width: 60, height: 60, borderRadius: 30 },
  info: { marginLeft: 15, flex: 1 },
  name: { ...theme.typography.h3, color: theme.colors.text },
  category: { ...theme.typography.small, color: theme.colors.textMuted, marginTop: 2, marginBottom: 6 },
  rating: { ...theme.typography.small, color: theme.colors.textMuted },
  arrow: { paddingLeft: theme.spacing.sm },
});

export default HomeScreen;