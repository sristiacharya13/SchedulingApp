import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

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
      <TouchableOpacity 
        style={styles.cancelBtn} 
        onPress={() => handleCancel(item.id)}
      >
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
          contentContainerStyle={{ padding: 20 }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No upcoming appointments.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    elevation: 2 
  },
  providerName: { fontSize: 18, fontWeight: 'bold' },
  details: { color: '#666', marginVertical: 4 },
  timeSlot: { fontWeight: '600', color: '#007AFF' },
  cancelBtn: { padding: 8 },
  cancelText: { color: '#ff3b30', fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 }
});

export default AppointmentsScreen;