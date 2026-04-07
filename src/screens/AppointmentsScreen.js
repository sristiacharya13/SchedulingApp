import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const AppointmentsScreen = () => {
  const { appointments, cancelAppointment } = useAuth();

  const handleCancel = (id) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes, Cancel", onPress: () => cancelAppointment(id), style: "destructive" }
      ]
    );
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.providerName}>{item.providerName}</Text>
        <Text style={styles.details}>{item.category} • {item.date}</Text>
        <Text style={styles.timeSlot}>Time: {item.time}</Text>
      </View>
      <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)} activeOpacity={0.85}>
        <Ionicons name="close-circle-outline" size={18} color={theme.colors.danger} />
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          contentContainerStyle={{ padding: theme.spacing.lg }}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="calendar-outline" size={26} color={theme.colors.onDark} />
          </View>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>When you book an appointment, it will show up here.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  card: { 
    backgroundColor: theme.colors.card, 
    padding: theme.spacing.md, 
    borderRadius: theme.radii.lg, 
    marginBottom: theme.spacing.md, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  providerName: { ...theme.typography.h3, color: theme.colors.text },
  details: { ...theme.typography.small, color: theme.colors.textMuted, marginTop: 4 },
  timeSlot: { ...theme.typography.small, color: theme.colors.primary, marginTop: 6, fontWeight: '800' },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    backgroundColor: 'rgba(216, 58, 58, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(216, 58, 58, 0.18)',
  },
  cancelText: { ...theme.typography.small, color: theme.colors.danger, fontWeight: '900' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  emptyIcon: {
    height: 54,
    width: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(244, 247, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 247, 255, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyTitle: { ...theme.typography.h2, color: theme.colors.onDark, marginBottom: 6, textAlign: 'center' },
  emptyText: { ...theme.typography.body, color: theme.colors.onDarkMuted, textAlign: 'center', lineHeight: 22 },
});

export default AppointmentsScreen;