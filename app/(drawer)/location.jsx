import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../context/SurveyContext';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { updateCurrentSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const fetchLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      let loc;
      try {
        // Use lower accuracy on web for instant results, high accuracy on mobile
        const accuracy = Platform.OS === 'web' 
          ? Location.Accuracy.Low 
          : Location.Accuracy.Balanced;

        // Set a strict 3-second timeout so it doesn't hang indefinitely
        loc = await Promise.race([
          Location.getCurrentPositionAsync({ accuracy }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]);
      } catch (liveError) {
        // Fallback: If live fetch times out, get the last known position instantly
        console.warn('Live location timed out or failed, falling back to last known position...');
        loc = await Location.getLastKnownPositionAsync();
        
        if (!loc) {
          throw new Error('Timeout and no last known position available.');
        }
      }
      
      setLocation(loc);
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to fetch location. Ensure GPS/Location services are enabled.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const copyToClipboard = async () => {
    if (location) {
      const text = `Lat: ${location.coords.latitude.toFixed(6)}, Lon: ${location.coords.longitude.toFixed(6)}`;
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', 'Location copied to clipboard.');
    }
  };

  const handleAttach = () => {
    if (location) {
      updateCurrentSurvey({
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        }
      });
      Alert.alert('Attached', 'Location attached to survey draft', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Ionicons name="location" size={48} color={themeColors.tint} />
        <Text style={[styles.title, { color: themeColors.text }]}>Current Location</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.tint} />
          <Text style={[styles.loadingText, { color: themeColors.text }]}>Fetching GPS coordinates...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
          <Text style={[styles.errorText, { color: themeColors.text }]}>{errorMsg}</Text>
          <Pressable style={[styles.button, { backgroundColor: themeColors.tint }]} onPress={fetchLocation}>
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      ) : location ? (
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC' }]}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Latitude</Text>
              <Text style={[styles.dataValue, { color: themeColors.text }]}>
                {location.coords.latitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Longitude</Text>
              <Text style={[styles.dataValue, { color: themeColors.text }]}>
                {location.coords.longitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Accuracy</Text>
              <Text style={[styles.dataValue, { color: themeColors.text }]}>
                ± {location.coords.accuracy ? location.coords.accuracy.toFixed(1) : 'Unknown'} meters
              </Text>
            </View>
          </View>

          <View style={styles.actionGrid}>
            <Pressable 
              style={[styles.actionBtn, { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]} 
              onPress={fetchLocation}
            >
              <Ionicons name="refresh-outline" size={24} color={themeColors.text} />
              <Text style={[styles.actionBtnText, { color: themeColors.text }]}>Refresh</Text>
            </Pressable>

            <Pressable 
              style={[styles.actionBtn, { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]} 
              onPress={copyToClipboard}
            >
              <Ionicons name="copy-outline" size={24} color={themeColors.text} />
              <Text style={[styles.actionBtnText, { color: themeColors.text }]}>Copy</Text>
            </Pressable>
          </View>

          <Pressable 
            style={[styles.attachButton, { backgroundColor: themeColors.tint }]} 
            onPress={handleAttach}
          >
            <Ionicons 
              name="checkmark-circle-outline" 
              size={24} 
              color={colorScheme === 'dark' ? '#065F46' : '#FFF'} 
            />
            <Text style={[
              styles.attachButtonText, 
              { color: colorScheme === 'dark' ? '#065F46' : '#FFF' }
            ]}>
              Attach to Draft
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 8,
    opacity: 0.5,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionBtn: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionBtnText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  attachButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
