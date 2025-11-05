import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../contexts/AuthContext'

// Screens
import LoginScreen from '../screens/LoginScreen'
import ShootsListScreen from '../screens/ShootsListScreen'
import ShootDetailScreen from '../screens/ShootDetailScreen'
import CreateShootScreen from '../screens/CreateShootScreen'

export type RootStackParamList = {
  Login: undefined
  ShootsList: undefined
  ShootDetail: { shootId: string }
  CreateShoot: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const { session, loading } = useAuth()

  if (loading) {
    return null // TODO: Add loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!session ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="ShootsList"
              component={ShootsListScreen}
              options={{ title: 'My Shoots' }}
            />
            <Stack.Screen
              name="ShootDetail"
              component={ShootDetailScreen}
              options={{ title: 'Shoot Details' }}
            />
            <Stack.Screen
              name="CreateShoot"
              component={CreateShootScreen}
              options={{ title: 'New Shoot', presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
