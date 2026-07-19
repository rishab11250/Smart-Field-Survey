import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../context/SurveyContext';
import { Spacing, Radius } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();
  const { updateCurrentSurvey } = useSurveys();

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#065F46" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Ionicons name="camera-outline" size={48} color="#94A3B8" />
        <Text style={styles.message}>Camera access is required to capture site photos</Text>
        <Pressable style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setIsLoading(true);
    try {
      const captured = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: false });
      setPhoto(captured);
      setCaptureTime(new Date().toISOString());
    } catch {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsLoading(false);
    }
  };

  const fmtTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        <View style={styles.timestamp}>
          <Ionicons name="time-outline" size={13} color="#FFF" />
          <Text style={styles.timestampText}>{fmtTime(captureTime)}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} onPress={() => {
            Alert.alert('Delete Photo', 'Remove this photo?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => { setPhoto(null); setCaptureTime(null); } },
            ]);
          }}>
            <Ionicons name="trash-outline" size={18} color="#FFF" />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.attachBtn]} onPress={() => {
            updateCurrentSurvey({ photoUri: photo.uri, photoTime: captureTime });
            Alert.alert('Attached', 'Photo added to survey draft', [{ text: 'OK', onPress: () => router.back() }]);
          }}>
            <Ionicons name="checkmark-circle" size={18} color="#FFF" />
            <Text style={styles.actionText}>Attach</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => { setPhoto(null); setCaptureTime(null); }}>
            <Ionicons name="camera-outline" size={18} color="#FFF" />
            <Text style={styles.actionText}>Retake</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing} />
      <Pressable style={styles.close} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color="#FFF" />
      </Pressable>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      <View style={styles.bottomBar}>
        <Pressable style={styles.flip} onPress={() => setFacing((c) => (c === 'back' ? 'front' : 'back'))}>
          <Ionicons name="camera-reverse-outline" size={20} color="#FFF" />
        </Pressable>
        <Pressable style={styles.shutter} onPress={takePicture}>
          <View style={styles.shutterInner} />
        </Pressable>
        <View style={{ width: 50 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: Spacing.lg },
  message: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 12, marginBottom: 20 },
  permBtn: { backgroundColor: '#065F46', paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.md },
  permBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  camera: { flex: 1 },
  close: { position: 'absolute', top: 50, left: 20, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  loading: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 5 },
  bottomBar: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 40 },
  flip: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  shutter: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#DC2626' },
  preview: { flex: 1 },
  timestamp: { position: 'absolute', bottom: 120, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
  timestampText: { color: '#FFF', fontSize: 13, marginLeft: 6, fontWeight: '500' },
  actions: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20 },
  actionBtn: { alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  attachBtn: { backgroundColor: '#065F46' },
  actionText: { color: '#FFF', fontSize: 12, fontWeight: '700', marginLeft: 6 },
});
