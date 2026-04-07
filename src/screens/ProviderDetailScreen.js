import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProviderDetailScreen = ({ route, navigation }) => {
  const { provider } = route.params;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { bookAppointment } = useAuth();

  const handleBooking = () => {
    if (!selectedSlot) {
      Alert.alert("Error", "Please select a time slot first");
      return;
    }

    const newAppointment = {
      providerId: provider.id,
      providerName: provider.name,
      category: provider.category,
      time: selectedSlot,
      date: new Date().toLocaleDateString(), // Mocking today's date
    };

    bookAppointment(newAppointment);
    Alert.alert(
      "Success", 
      "Appointment booked successfully!",
      [{ text: "OK", onPress: () => navigation.navigate('Home') }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: provider.image }} style={styles.banner} />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.category}>{provider.category}</Text>
        <Text style={styles.aboutTitle}>About</Text>
        <Text style={styles.aboutText}>{provider.about}</Text>

        <Text style={styles.sectionTitle}>Available Slots</Text>
        <View style={styles.slotGrid}>
          {provider.slots.map((slot) => (
            <TouchableOpacity 
              key={slot} 
              style={[
                styles.slot, 
                selectedSlot === slot && styles.selectedSlot
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[
                styles.slotText, 
                selectedSlot === slot && styles.selectedSlotText
              ]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Confirm Appointment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: { width: '100%', height: 250 },
  detailsContainer: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20, backgroundColor: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 16, color: '#007AFF', marginBottom: 15 },
  aboutTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  aboutText: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, width: '30%', alignItems: 'center' },
  selectedSlot: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  slotText: { color: '#333' },
  selectedSlotText: { color: '#fff', fontWeight: 'bold' },
  bookButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ProviderDetailScreen;