import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { PROVIDERS } from '../utils/mockData';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const renderProvider = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProviderDetail', { provider: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={{color: '#007AFF'}}>View</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        {/* Updated section to hold both buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}></View>
        <TouchableOpacity 
            onPress={() => navigation.navigate('MyAppointments')}
            style={{ marginRight: 20 }}
          >
            <Text style={styles.bookingsLink}>My Bookings</Text>
          </TouchableOpacity>
        <TouchableOpacity onPress={logout}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  userName: { fontSize: 20, fontWeight: 'bold' },
  logoutText: { color: 'red', fontWeight: 'bold' },
  list: { padding: 15 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3, // Shadow for Android
  },
  image: { width: 60, height: 60, borderRadius: 30 },
  info: { marginLeft: 15, flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  category: { color: '#666', marginVertical: 2 },
  rating: { fontSize: 14, color: '#444' },
  bookingsLink: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;