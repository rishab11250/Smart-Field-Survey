import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert, Image, Modal } from 'react-native';
import { useSurveys } from '../../../context/SurveyContext';
import { Colors } from '../../../constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';

export default function SurveyHistory() {
  const { surveys, deleteSurvey } = useSurveys();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  // For deep linking from the dashboard's "Recent Surveys"
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.search || '');
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(params.search || null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Survey',
      'Are you sure you want to permanently delete this survey?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            deleteSurvey(id);
            if (expandedId === id) setExpandedId(null);
          }
        }
      ]
    );
  };

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const matchesSearch = 
        survey.siteName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        survey.id?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        activeFilter === 'All' || 
        survey.priority?.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [surveys, searchQuery, activeFilter]);

  const FilterPill = ({ label }) => {
    const isActive = activeFilter === label;
    return (
      <Pressable
        style={[
          styles.filterPill,
          isActive 
            ? { backgroundColor: themeColors.tint, borderColor: themeColors.tint }
            : { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: isDark ? '#334155' : '#E2E8F0' }
        ]}
        onPress={() => setActiveFilter(label)}
      >
        <Text style={[
          styles.filterPillText, 
          { color: isActive ? (isDark ? '#065F46' : '#FFF') : themeColors.text }
        ]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  const renderSurveyItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const priColor = getPriorityColor(item.priority);

    return (
      <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
        
        {/* Compact Header (Always Visible) */}
        <Pressable 
          style={styles.cardHeader} 
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
        >
          <View style={styles.cardHeaderLeft}>
            <View style={styles.idRow}>
              <Text style={[styles.surveyId, { color: themeColors.tint }]}>{item.id}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: priColor + '20' }]}>
                <Text style={[styles.priorityText, { color: priColor }]}>{item.priority}</Text>
              </View>
            </View>
            <Text style={[styles.siteName, { color: themeColors.text }]} numberOfLines={1}>
              {item.siteName}
            </Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={12} color="#64748B" />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </View>
          
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#94A3B8" 
          />
        </Pressable>

        {/* Expanded Details View */}
        {isExpanded && (
          <View style={[styles.expandedContent, { borderTopColor: isDark ? '#334155' : '#E2E8F0' }]}>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Client:</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{item.clientName}</Text>
            </View>
            
            <View style={styles.detailRowVertical}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={[styles.detailValueBlock, { color: themeColors.text }]}>{item.description}</Text>
            </View>

            {item.notes && (
              <View style={styles.detailRowVertical}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={[styles.detailValueBlock, { color: themeColors.text, fontStyle: 'italic' }]}>{item.notes}</Text>
              </View>
            )}

            {/* Attachments Section inside Expand */}
            {(item.location || item.contact || item.photoUri) && (
              <View style={styles.attachmentsArea}>
                <Text style={styles.detailLabel}>Attachments:</Text>
                
                {item.location && (
                  <Text style={[styles.attachmentText, { color: themeColors.text }]}>
                    📍 Lat: {item.location.latitude.toFixed(4)}, Lon: {item.location.longitude.toFixed(4)}
                  </Text>
                )}
                
                {item.contact && (
                  <Text style={[styles.attachmentText, { color: themeColors.text }]}>
                    👤 {item.contact.name} ({item.contact.phoneNumber})
                  </Text>
                )}

                {item.photoUri && (
                  <Pressable onPress={() => setFullscreenImage(item.photoUri)}>
                    <Image source={{ uri: item.photoUri }} style={styles.thumbnail} resizeMode="cover" />
                  </Pressable>
                )}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionRow}>
              <Pressable 
                style={styles.deleteButton} 
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={styles.deleteButtonText}>Delete Record</Text>
              </Pressable>
            </View>

          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      {/* Search & Filters */}
      <View style={styles.headerArea}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
          <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Search by ID or Site Name..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#64748B" />
            </Pressable>
          )}
        </View>

        <View style={styles.filterRow}>
          <FilterPill label="All" />
          <FilterPill label="High" />
          <FilterPill label="Medium" />
          <FilterPill label="Low" />
        </View>
      </View>

      {/* List */}
      {filteredSurveys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="documents-outline" size={48} color="#CBD5E1" />
          <Text style={[styles.emptyText, { color: themeColors.text }]}>No surveys found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filters.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSurveys}
          keyExtractor={(item) => item.id}
          renderItem={renderSurveyItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Fullscreen Image Viewer Modal */}
      <Modal
        visible={!!fullscreenImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullscreenImage(null)}
      >
        <View style={styles.modalBackground}>
          <Pressable style={styles.modalCloseButton} onPress={() => setFullscreenImage(null)}>
            <Ionicons name="close" size={32} color="#FFF" />
          </Pressable>
          {fullscreenImage && (
            <Image 
              source={{ uri: fullscreenImage }} 
              style={styles.fullScreenImage} 
              resizeMode="contain" 
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  surveyId: {
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.02)',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailRowVertical: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginRight: 6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValueBlock: {
    fontSize: 14,
    lineHeight: 20,
  },
  attachmentsArea: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  attachmentText: {
    fontSize: 13,
    marginBottom: 4,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  actionRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EF444415',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});
