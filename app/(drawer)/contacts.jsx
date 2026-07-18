import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  Pressable, 
  ActivityIndicator, 
  RefreshControl,
  Alert 
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../context/SurveyContext';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();
  const { updateCurrentSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const fetchContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
          sort: Contacts.SortTypes.FirstName,
        });

        if (data.length > 0) {
          setContacts(data);
          setFilteredContacts(data);
        } else {
          setContacts([]);
          setFilteredContacts([]);
        }
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Failed to load contacts.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchContacts();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) => 
        contact.name && contact.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const getPrimaryPhoneNumber = (contact) => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      return contact.phoneNumbers[0].number;
    }
    return null;
  };

  const copyToClipboard = async (phoneNumber) => {
    if (phoneNumber) {
      await Clipboard.setStringAsync(phoneNumber);
      Alert.alert('Copied!', `Phone number ${phoneNumber} copied to clipboard.`);
    }
  };

  const handleAttach = (contact, phoneNumber) => {
    if (phoneNumber) {
      updateCurrentSurvey({
        contact: {
          name: contact.name || 'Unknown',
          phoneNumber: phoneNumber,
        }
      });
      Alert.alert('Attached', `Contact attached to survey draft`, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  const renderContactItem = ({ item }) => {
    const phoneNumber = getPrimaryPhoneNumber(item);
    const initial = item.name ? item.name.charAt(0).toUpperCase() : '#';
    const isDark = colorScheme === 'dark';

    return (
      <View style={[styles.contactCard, { 
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderColor: isDark ? '#334155' : '#E2E8F0',
      }]}>
        <View style={[styles.avatar, { backgroundColor: isDark ? '#065F46' : '#D1FAE5' }]}>
          <Text style={[styles.avatarText, { color: isDark ? '#FFF' : '#065F46' }]}>{initial}</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: themeColors.text }]} numberOfLines={1}>
            {item.name || 'Unknown'}
          </Text>
          {phoneNumber ? (
            <Text style={styles.contactPhone}>{phoneNumber}</Text>
          ) : (
            <Text style={styles.noPhoneText}>No Number Available</Text>
          )}
        </View>

        <View style={styles.contactActions}>
          <Pressable 
            style={[styles.actionBtn, !phoneNumber && styles.actionBtnDisabled]} 
            onPress={() => copyToClipboard(phoneNumber)}
            disabled={!phoneNumber}
          >
            <Ionicons name="copy-outline" size={20} color={phoneNumber ? themeColors.tint : '#94A3B8'} />
          </Pressable>
          <View style={styles.actionDivider} />
          <Pressable 
            style={[styles.actionBtn, !phoneNumber && styles.actionBtnDisabled]} 
            onPress={() => handleAttach(item, phoneNumber)}
            disabled={!phoneNumber}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={phoneNumber ? themeColors.tint : '#94A3B8'} />
          </Pressable>
        </View>
      </View>
    );
  };

  if (hasPermission === false) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: themeColors.background }]}>
        <Ionicons name="people-outline" size={48} color="#94A3B8" />
        <Text style={[styles.message, { color: themeColors.text }]}>Contacts permission is required</Text>
        <Pressable style={styles.permissionButton} onPress={fetchContacts}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9' }]}>
          <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Search contacts..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#64748B" />
            </Pressable>
          )}
        </View>
        <View style={styles.counterRow}>
          <Text style={styles.counterText}>
            Showing {filteredContacts.length} {filteredContacts.length === 1 ? 'Contact' : 'Contacts'}
          </Text>
        </View>
      </View>

      {isLoading && !isRefreshing ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={themeColors.tint} />
        </View>
      ) : filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#CBD5E1" />
          <Text style={[styles.emptyText, { color: themeColors.text }]}>No contacts found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search query</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[themeColors.tint]}
              tintColor={themeColors.tint}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  counterRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  counterText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 13,
    color: '#64748B',
  },
  noPhoneText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 8,
    padding: 4,
  },
  actionBtn: {
    padding: 8,
  },
  actionBtnDisabled: {
    opacity: 0.3,
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#065F46',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
});
