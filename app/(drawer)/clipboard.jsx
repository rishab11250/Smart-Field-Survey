import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import { useSurveys } from '../../context/SurveyContext';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ClipboardScreen() {
  const [clipboardContent, setClipboardContent] = useState('');
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions({ writeOnly: true });
  
  const { currentSurvey, updateCurrentSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const fetchClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    setClipboardContent(text);
  };

  // Poll clipboard occasionally or on mount
  useEffect(() => {
    fetchClipboard();
    const interval = setInterval(fetchClipboard, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async (type, text) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    setClipboardContent(text);
    Alert.alert('Copied!', `${type} copied to clipboard.`);
  };

  const handleClearClipboard = async () => {
    await Clipboard.setStringAsync('');
    setClipboardContent('');
    Alert.alert('Cleared', 'Clipboard data has been cleared.');
  };

  const handlePasteNotes = () => {
    if (!clipboardContent) {
      Alert.alert('Empty', 'There is nothing in the clipboard to paste.');
      return;
    }

    const existingNotes = currentSurvey.notes || '';
    const newNotes = existingNotes 
      ? `${existingNotes}\n${clipboardContent}` 
      : clipboardContent;
      
    updateCurrentSurvey({ notes: newNotes });
    Alert.alert('Pasted!', 'Clipboard content appended to your survey notes.');
  };

  const handleSaveToGallery = async () => {
    if (!currentSurvey.photoUri) return;

    try {
      if (mediaPermission?.status !== 'granted') {
        const permission = await requestMediaPermission();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'We need access to your photo gallery to save the image.');
          return;
        }
      }

      await MediaLibrary.saveToLibraryAsync(currentSurvey.photoUri);
      Alert.alert('Success!', 'Photo saved to your device gallery.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save the photo.');
    }
  };

  // Data extractors
  const tempId = `DRAFT-${new Date().toISOString().split('T')[0]}`;
  const contactStr = currentSurvey.contact?.phoneNumber || '';
  const locStr = currentSurvey.location 
    ? `Lat: ${currentSurvey.location.latitude.toFixed(5)}, Lon: ${currentSurvey.location.longitude.toFixed(5)}`
    : '';

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      {/* Top Section: Copy From Draft */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="push-outline" size={24} color={themeColors.tint} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Copy from Draft</Text>
        </View>
        <Text style={styles.sectionSub}>Extract data from your current active survey draft.</Text>

        <Pressable 
          style={[styles.actionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]} 
          onPress={() => handleCopy('Survey ID', tempId)}
        >
          <View style={styles.actionCardLeft}>
            <Text style={styles.actionCardLabel}>Survey ID (Draft)</Text>
            <Text style={[styles.actionCardValue, { color: themeColors.text }]}>{tempId}</Text>
          </View>
          <Ionicons name="copy-outline" size={24} color={themeColors.tint} />
        </Pressable>

        <Pressable 
          style={[
            styles.actionCard, 
            { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' },
            !contactStr && styles.disabledCard
          ]} 
          onPress={() => handleCopy('Contact Number', contactStr)}
          disabled={!contactStr}
        >
          <View style={styles.actionCardLeft}>
            <Text style={styles.actionCardLabel}>Contact Number</Text>
            <Text style={[styles.actionCardValue, { color: contactStr ? themeColors.text : '#94A3B8' }]}>
              {contactStr || 'No contact attached'}
            </Text>
          </View>
          <Ionicons name="copy-outline" size={24} color={contactStr ? themeColors.tint : '#94A3B8'} />
        </Pressable>

        <Pressable 
          style={[
            styles.actionCard, 
            { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' },
            !locStr && styles.disabledCard
          ]} 
          onPress={() => handleCopy('Location', locStr)}
          disabled={!locStr}
        >
          <View style={styles.actionCardLeft}>
            <Text style={styles.actionCardLabel}>Current Location</Text>
            <Text style={[styles.actionCardValue, { color: locStr ? themeColors.text : '#94A3B8' }]} numberOfLines={1}>
              {locStr || 'No location attached'}
            </Text>
          </View>
          <Ionicons name="copy-outline" size={24} color={locStr ? themeColors.tint : '#94A3B8'} />
        </Pressable>

        {currentSurvey.photoUri ? (
          <View style={[styles.largeImageCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
            <Image 
              source={{ uri: currentSurvey.photoUri }} 
              style={styles.largePreviewImage}
              resizeMode="cover"
            />
            <View style={styles.largeImageFooter}>
              <View style={styles.actionCardLeft}>
                <Text style={styles.actionCardLabel}>Attached Photo</Text>
                <Text style={[styles.actionCardValue, { color: themeColors.text }]}>Ready to save</Text>
              </View>
              <Pressable 
                style={[styles.saveGalleryBtn, { backgroundColor: themeColors.tint }]} 
                onPress={handleSaveToGallery}
              >
                <Ionicons name="download-outline" size={20} color={isDark ? '#065F46' : '#FFF'} />
                <Text style={[styles.saveGalleryBtnText, { color: isDark ? '#065F46' : '#FFF' }]}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={[styles.actionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }, styles.disabledCard]}>
            <View style={styles.actionCardLeft}>
              <Text style={styles.actionCardLabel}>Attached Photo</Text>
              <Text style={[styles.actionCardValue, { color: '#94A3B8' }]}>No photo attached</Text>
            </View>
            <Ionicons name="image-outline" size={24} color="#94A3B8" />
          </View>
        )}
      </View>

      {/* Middle Section: Clipboard Management */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="clipboard-outline" size={24} color={themeColors.tint} />
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Clipboard Content</Text>
        </View>

        <View style={[styles.clipboardViewer, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
          {clipboardContent ? (
            <Text style={[styles.clipboardText, { color: themeColors.text }]}>{clipboardContent}</Text>
          ) : (
            <Text style={styles.emptyClipboardText}>Clipboard is currently empty.</Text>
          )}
        </View>

        <View style={styles.actionRow}>
          <Pressable 
            style={[styles.primaryButton, { backgroundColor: themeColors.tint, flex: 1, marginRight: 12 }]} 
            onPress={handlePasteNotes}
          >
            <Ionicons name="document-text-outline" size={20} color={isDark ? '#065F46' : '#FFF'} />
            <Text style={[styles.primaryButtonText, { color: isDark ? '#065F46' : '#FFF' }]}>
              Paste to Notes
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.secondaryButton, { borderColor: '#EF4444' }]} 
            onPress={handleClearClipboard}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </Pressable>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionCardLeft: {
    flex: 1,
    marginRight: 16,
  },
  actionCardLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  actionCardValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailPreview: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
  },
  largeImageCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  largePreviewImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
  },
  largeImageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  saveGalleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveGalleryBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  disabledCard: {
    opacity: 0.6,
  },
  clipboardViewer: {
    minHeight: 100,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    justifyContent: 'center',
  },
  clipboardText: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyClipboardText: {
    fontSize: 15,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
