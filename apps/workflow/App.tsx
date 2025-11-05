import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text } from 'react-native'
import { AuthProvider } from './src/contexts/AuthContext'
import { RootNavigator } from './src/navigation/RootNavigator'

export default function App() {
  console.log('🚀 Studio37 Workflow App Loading...')
  
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  )
}
