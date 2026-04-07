import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { theme } from './src/theme/theme';

// We will create these screens next
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProviderDetailScreen from './src/screens/ProviderDetailScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
const Stack = createNativeStackNavigator();

function RootNavigation() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onDark,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      {user ? (
        <>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProviderDetail" component={ProviderDetailScreen} options={{ title: 'Book appointment' }} />  
        <Stack.Screen name="MyAppointments" component={AppointmentsScreen} options={{ title: 'My bookings' }} />
        </>
    ) : (
        // Screens for logged-out users
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}