import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/RootNavigator'
import { useAuth } from '../contexts/AuthContext'
import { getLocalShoots, initializeDatabase } from '../lib/database'
import { supabase } from '../lib/supabase'
import type { Shoot } from '@studio37/shared'
import { formatShootDate, calculateShootProgress } from '@studio37/shared'

type Props = NativeStackScreenProps<RootStackParamList, 'ShootsList'>

export default function ShootsListScreen({ navigation }: Props) {
  const { signOut, appUser } = useAuth()
  const [shoots, setShoots] = useState<Shoot[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Initialize database on mount
    try {
      initializeDatabase()
      loadShoots()
    } catch (error) {
      console.error('Error initializing database:', error)
      Alert.alert('Error', 'Failed to initialize local database')
    }

    // Set up header buttons
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('CreateShoot')}>
            <Text style={styles.headerButton}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.headerButton}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [])

  async function loadShoots() {
    try {
      // Load from local database first
      const localShoots = getLocalShoots()
      setShoots(localShoots)

      // Then sync with Supabase
      await syncShoots()
    } catch (error) {
      console.error('Error loading shoots:', error)
    }
  }

  async function syncShoots() {
    if (!appUser?.tenant_id) return

    try {
      const { data, error } = await supabase
        .from('shoots')
        .select('*')
        .eq('tenant_id', appUser.tenant_id)
        .order('shoot_date', { ascending: false })

      if (error) throw error

      // TODO: Merge with local database
      // For now, just show remote data
      if (data) {
        setShoots(data as Shoot[])
      }
    } catch (error) {
      console.error('Error syncing shoots:', error)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    await syncShoots()
    setRefreshing(false)
  }

  async function handleSignOut() {
    try {
      await signOut()
    } catch (error: any) {
      Alert.alert('Error', error.message)
    }
  }

  function renderShoot({ item }: { item: Shoot }) {
    const progress = calculateShootProgress(item.shot_list)
    const statusColor = {
      planned: '#94a3b8',
      in_progress: '#3b82f6',
      completed: '#10b981',
      delivered: '#8b5cf6',
      cancelled: '#ef4444',
    }[item.status]

    return (
      <TouchableOpacity
        style={styles.shootCard}
        onPress={() => navigation.navigate('ShootDetail', { shootId: item.id })}
      >
        <View style={styles.shootHeader}>
          <Text style={styles.shootTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {item.shoot_date && (
          <Text style={styles.shootDate}>
            {formatShootDate(item.shoot_date)}
            {item.shoot_time && ` at ${item.shoot_time}`}
          </Text>
        )}

        {item.location_name && (
          <Text style={styles.shootLocation}>📍 {item.location_name}</Text>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <Text style={styles.shotCount}>
          {item.shot_list.filter(s => s.completed).length} / {item.shot_list.length} shots
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {shoots.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No shoots yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateShoot')}
          >
            <Text style={styles.createButtonText}>Create Your First Shoot</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={shoots}
          keyExtractor={item => item.id}
          renderItem={renderShoot}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  shootCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  shootHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shootTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  shootDate: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  shootLocation: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#b46e14',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  shotCount: {
    fontSize: 12,
    color: '#64748b',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#b46e14',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
