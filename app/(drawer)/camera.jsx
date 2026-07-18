import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useSurveys } from '../../context/SurveyContext';
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
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#065F46" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="camera-outline" size={48} color="#94A3B8" />
        <Text style={styles.message}>Camera permission is required</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      try {
        const captured = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setPhoto(captured);
        setCaptureTime(new Date().toISOString());
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleCamera = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleAttach = () => {
    updateCurrentSurvey({
      photoUri: photo.uri,
      photoTime: captureTime,
    });
    Alert.alert('Attached', 'Photo attached to survey draft', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleRetake = () => {
    setPhoto(null);
    setCaptureTime(null);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPhoto(null);
            setCaptureTime(null);
          },
        },
      ]
    );
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        <View style={styles.timestampBar}>
          <Ionicons name="time-outline" size={16} color="#FFF" />
          <Text style={styles.timestampText}>Captured: {formatTime(captureTime)}</Text>
        </View>
        <View style={styles.previewActions}>
          <Pressable style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#FFF" />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
          <Pressable style={styles.actionButtonPrimary} onPress={handleAttach}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            <Text style={styles.actionText}>Attach to Draft</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleRetake}>
            <Ionicons name="camera-outline" size={20} color="#FFF" />
            <Text style={styles.actionText}>Retake</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing} />
      <View style={styles.topBar}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFF" />
        </Pressable>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}

      <View style={styles.cameraActions}>
        <Pressable style={styles.flipButton} onPress={toggleCamera}>
          <Ionicons name="camera-reverse-outline" size={24} color="#FFF" />
        </Pressable>
        <Pressable style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureInner} />
        </Pressable>
        <View style={styles.flipButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
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
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 5,
  },
  cameraActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EF4444',
  },
  preview: {
    flex: 1,
  },
  timestampBar: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  timestampText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 8,
  },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
  },
  actionButtonPrimary: {
    alignItems: 'center',
    backgroundColor: '#065F46',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
  },
  actionText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
});
