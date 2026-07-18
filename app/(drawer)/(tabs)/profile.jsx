import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
import { useSurveys } from '../../../context/SurveyContext';

export default function Profile() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { studentDetails, setStudentDetails } = useSurveys();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(studentDetails);

  const handleSave = () => {
    setStudentDetails(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(studentDetails);
    setIsEditing(false);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'ID';
    const names = name.split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const isDark = colorScheme === 'dark';

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header Profile Section */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getInitials(studentDetails.name)}</Text>
        </View>
        <Text style={[styles.name, { color: themeColors.text }]}>{studentDetails.name}</Text>
        <Text style={styles.subtext}>Student Inspector</Text>
        
        {!isEditing && (
          <Pressable 
            style={[styles.editProfileBtn, { borderColor: themeColors.tint }]} 
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="pencil" size={16} color={themeColors.tint} />
            <Text style={[styles.editProfileText, { color: themeColors.tint }]}>Edit Profile</Text>
          </Pressable>
        )}
      </View>

      {/* Details List */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Academic Details</Text>
        
        <View style={[styles.detailRow, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="person-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput 
                style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.tint }]} 
                value={editForm.name}
                onChangeText={(text) => setEditForm({...editForm, name: text})}
              />
            ) : (
              <Text style={[styles.rowValue, { color: themeColors.text }]}>{studentDetails.name}</Text>
            )}
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="card-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Student ID / Roll No</Text>
            {isEditing ? (
              <TextInput 
                style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.tint }]} 
                value={editForm.id}
                onChangeText={(text) => setEditForm({...editForm, id: text})}
              />
            ) : (
              <Text style={[styles.rowValue, { color: themeColors.text }]}>{studentDetails.id}</Text>
            )}
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="school-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Class & Semester</Text>
            {isEditing ? (
              <TextInput 
                style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.tint }]} 
                value={editForm.className}
                onChangeText={(text) => setEditForm({...editForm, className: text})}
              />
            ) : (
              <Text style={[styles.rowValue, { color: themeColors.text }]}>{studentDetails.className}</Text>
            )}
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="book-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Course</Text>
            {isEditing ? (
              <TextInput 
                style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.tint }]} 
                value={editForm.course}
                onChangeText={(text) => setEditForm({...editForm, course: text})}
              />
            ) : (
              <Text style={[styles.rowValue, { color: themeColors.text }]}>{studentDetails.course}</Text>
            )}
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="mail-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Email</Text>
            {isEditing ? (
              <TextInput 
                style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.tint }]} 
                value={editForm.email}
                onChangeText={(text) => setEditForm({...editForm, email: text})}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            ) : (
              <Text style={[styles.rowValue, { color: themeColors.text }]}>{studentDetails.email}</Text>
            )}
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="ribbon-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Project Assignment</Text>
            {isEditing ? (
              <TextInput 
                style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.tint }]} 
                value={editForm.project}
                onChangeText={(text) => setEditForm({...editForm, project: text})}
              />
            ) : (
              <Text style={[styles.rowValue, { color: themeColors.text }]}>{studentDetails.project}</Text>
            )}
          </View>
        </View>

        <View style={[styles.detailRow, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <Ionicons name="calendar-outline" size={20} color="#065F46" style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Academic Year</Text>
            {isEditing ? (
              <TextInput 
                style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.tint }]} 
                value={editForm.year}
                onChangeText={(text) => setEditForm({...editForm, year: text})}
                keyboardType="numeric"
              />
            ) : (
              <Text style={[styles.rowValue, { color: themeColors.text }]}>{studentDetails.year}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Save / Cancel Buttons */}
      {isEditing && (
        <View style={styles.editActionsRow}>
          <Pressable style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.saveBtn, { backgroundColor: themeColors.tint }]} onPress={handleSave}>
            <Text style={[styles.saveBtnText, { color: isDark ? '#065F46' : '#FFF' }]}>Save Changes</Text>
          </Pressable>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#065F46',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowIcon: {
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  editInput: {
    borderBottomWidth: 1,
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
    paddingVertical: 2,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editProfileText: {
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  editActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 40,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 0.45,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  cancelBtnText: {
    fontWeight: 'bold',
    color: '#64748B',
  },
  saveBtn: {
    flex: 0.5,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  saveBtnText: {
    fontWeight: 'bold',
  },
});
