import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/RootNavigator'
import { useAuth } from '../contexts/AuthContext'
import { saveLocalShoot } from '../lib/database'
import type { Shoot } from '@studio37/shared'
import { DEFAULT_WEDDING_SHOT_LIST, DEFAULT_EQUIPMENT_CHECKLIST } from '@studio37/shared'

type Props = NativeStackScreenProps<RootStackParamList, 'CreateShoot'>

export default function CreateShootScreen({ navigation }: Props) {
  const { appUser } = useAuth()
  const [title, setTitle] = useState('')
  const [shootType, setShootType] = useState('wedding')
  const [shootDate, setShootDate] = useState('')
  const [locationName, setLocationName] = useState('')

  async function handleCreate() {
    if (!title) {
      Alert.alert('Error', 'Please enter a title')
      return
    }

    if (!appUser) {
      Alert.alert('Error', 'Not authenticated')
      return
    }

    const newShoot: Shoot = {
      id: `shoot_${Date.now()}`,
      tenant_id: appUser.tenant_id,
      photographer_id: appUser.id,
      title,
      shoot_type: shootType,
      shoot_date: shootDate || undefined,
      location_name: locationName || undefined,
      shot_list: shootType === 'wedding' ? DEFAULT_WEDDING_SHOT_LIST : [],
      equipment_checklist: DEFAULT_EQUIPMENT_CHECKLIST,
      status: 'planned',
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      saveLocalShoot(newShoot)
      Alert.alert('Success', 'Shoot created!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error('Error creating shoot:', error)
      Alert.alert('Error', 'Failed to create shoot')
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Sarah & John Wedding"
          placeholderTextColor="#64748b"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Shoot Type</Text>
        <View style={styles.typeButtons}>
          {['wedding', 'portrait', 'event', 'commercial'].map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, shootType === type && styles.typeButtonActive]}
              onPress={() => setShootType(type)}
            >
              <Text style={[styles.typeButtonText, shootType === type && styles.typeButtonTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#64748b"
          value={shootDate}
          onChangeText={setShootDate}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Venue name or address"
          placeholderTextColor="#64748b"
          value={locationName}
          onChangeText={setLocationName}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create Shoot</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#334155',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  typeButtonActive: {
    backgroundColor: '#b46e14',
    borderColor: '#b46e14',
  },
  typeButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#b46e14',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
