import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const ProviderDetailScreen = ({ route, navigation }) => {
  const { provider } = route.params;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const { bookAppointment } = useAuth();

  const handleBooking = () => {
    if (!selectedSlot) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Error", "Please select a time slot first");
      return;
    }
    setIsBooking(true);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newAppointment = {
      providerId: provider.id,
      providerName: provider.name,
      category: provider.category,
      time: selectedSlot,
      date: new Date().toLocaleDateString(), // Mocking today's date
    };

    bookAppointment(newAppointment);
    setTimeout(()=>{
    Alert.alert(
      "Success", 
      "Appointment booked successfully!",
      [{ text: "OK", onPress: () => {setIsBooking(false); navigation.navigate('Home') }}]
    );
  },1000);
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
              onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedSlot(slot)}}
              activeOpacity={0.9}
            >
              <Text style={[
                styles.slotText, 
                selectedSlot === slot && styles.selectedSlotText
              ]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.bookButton, isBooking && styles.successButton]} 
          onPress={handleBooking}
          disabled={isBooking}
          activeOpacity={0.9}
        >
          <Text style={styles.bookButtonText}>{isBooking ? "✓ Booked!":"Confirm Appointment"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  banner: { width: '100%', height: 250 },
  detailsContainer: {
    padding: theme.spacing.lg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -22,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  name: { ...theme.typography.h2, color: theme.colors.text, fontSize: 24 },
  category: { ...theme.typography.small, color: theme.colors.primary, marginTop: 6, marginBottom: theme.spacing.md, fontWeight: '900' },
  aboutTitle: { ...theme.typography.h3, marginBottom: 6, color: theme.colors.text },
  aboutText: { ...theme.typography.body, color: theme.colors.textMuted, lineHeight: 22, marginBottom: theme.spacing.lg },
  sectionTitle: { ...theme.typography.h3, marginBottom: theme.spacing.sm, color: theme.colors.text },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  slot: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    width: '30%',
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 12,
  },
  selectedSlot: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  slotText: { ...theme.typography.small, color: theme.colors.text, fontWeight: '800' },
  selectedSlotText: { color: '#fff' },
  bookButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 14,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  bookButtonText: { ...theme.typography.h3, color: '#fff' },
  successButton: { backgroundColor: '#2BB673' },
});

export default ProviderDetailScreen;