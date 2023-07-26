import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import RootLayout from './src/screens/RootLayout';

SplashScreen.preventAutoHideAsync();
export default function App() {
  return (
    <AuthProvider>
      <RootLayout></RootLayout>
    </AuthProvider>
  );
}
