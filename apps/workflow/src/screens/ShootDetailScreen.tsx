import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/RootNavigator'

type Props = NativeStackScreenProps<RootStackParamList, 'ShootDetail'>

export default function ShootDetailScreen({ route }: Props) {
  const { shootId } = route.params

  // TODO: Load shoot details from local database
  // TODO: Show shot checklist
  // TODO: Show equipment checklist
  // TODO: Add GPS tagging
  // TODO: Add photo upload

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Shoot Details</Text>
        <Text style={styles.text}>Shoot ID: {shootId}</Text>
        <Text style={styles.placeholder}>
          Coming next:{'\n\n'}
          • Shot checklist with tap-to-complete{'\n'}
          • Equipment verification{'\n'}
          • GPS location tagging{'\n'}
          • Photo upload queue{'\n'}
          • Real-time progress tracking
        </Text>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 24,
  },
})
