import * as SQLite from 'expo-sqlite'
import type { Shoot, ShootPhoto } from '@studio37/shared'

const DB_NAME = 'studio37_workflow.db'

// Open database
export const db = SQLite.openDatabaseSync(DB_NAME)

// Initialize offline database schema
export function initializeDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS shoots (
      id TEXT PRIMARY KEY,
      tenant_id TEXT,
      client_id TEXT,
      photographer_id TEXT,
      title TEXT NOT NULL,
      shoot_type TEXT,
      shoot_date TEXT,
      shoot_time TEXT,
      location_name TEXT,
      location_address TEXT,
      location_lat REAL,
      location_lng REAL,
      shot_list TEXT,
      equipment_checklist TEXT,
      notes TEXT,
      status TEXT DEFAULT 'planned',
      metadata TEXT,
      created_at TEXT,
      updated_at TEXT,
      completed_at TEXT,
      synced INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS shoot_photos (
      id TEXT PRIMARY KEY,
      shoot_id TEXT NOT NULL,
      gallery_image_id TEXT,
      shot_list_item_id TEXT,
      sequence_number INTEGER,
      local_uri TEXT,
      metadata TEXT,
      upload_source TEXT DEFAULT 'workflow_app',
      uploaded_at TEXT,
      created_at TEXT,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (shoot_id) REFERENCES shoots(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      action TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      retry_count INTEGER DEFAULT 0
    );
    
    CREATE INDEX IF NOT EXISTS idx_shoots_synced ON shoots(synced);
    CREATE INDEX IF NOT EXISTS idx_shoot_photos_synced ON shoot_photos(synced);
    CREATE INDEX IF NOT EXISTS idx_shoot_photos_shoot_id ON shoot_photos(shoot_id);
  `)
}

// Shoot operations
export function getLocalShoots(): Shoot[] {
  const result = db.getAllSync<any>('SELECT * FROM shoots ORDER BY shoot_date DESC, created_at DESC')
  return result.map(row => ({
    ...row,
    shot_list: JSON.parse(row.shot_list || '[]'),
    equipment_checklist: JSON.parse(row.equipment_checklist || '[]'),
    metadata: JSON.parse(row.metadata || '{}'),
  }))
}

export function getLocalShoot(id: string): Shoot | null {
  const result = db.getFirstSync<any>('SELECT * FROM shoots WHERE id = ?', [id])
  if (!result) return null
  
  return {
    ...result,
    shot_list: JSON.parse(result.shot_list || '[]'),
    equipment_checklist: JSON.parse(result.equipment_checklist || '[]'),
    metadata: JSON.parse(result.metadata || '{}'),
  }
}

export function saveLocalShoot(shoot: Shoot) {
  const sql = `
    INSERT OR REPLACE INTO shoots (
      id, tenant_id, client_id, photographer_id, title, shoot_type,
      shoot_date, shoot_time, location_name, location_address,
      location_lat, location_lng, shot_list, equipment_checklist,
      notes, status, metadata, created_at, updated_at, completed_at, synced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  
  db.runSync(sql, [
    shoot.id,
    shoot.tenant_id || null,
    shoot.client_id || null,
    shoot.photographer_id || null,
    shoot.title,
    shoot.shoot_type || null,
    shoot.shoot_date || null,
    shoot.shoot_time || null,
    shoot.location_name || null,
    shoot.location_address || null,
    shoot.location_lat || null,
    shoot.location_lng || null,
    JSON.stringify(shoot.shot_list),
    JSON.stringify(shoot.equipment_checklist),
    shoot.notes || null,
    shoot.status,
    JSON.stringify(shoot.metadata),
    shoot.created_at,
    shoot.updated_at,
    shoot.completed_at || null,
    0 // Not synced yet
  ])
  
  // Add to sync queue
  addToSyncQueue('shoot', shoot.id, 'upsert', shoot)
}

export function deleteLocalShoot(id: string) {
  db.runSync('DELETE FROM shoots WHERE id = ?', [id])
  addToSyncQueue('shoot', id, 'delete', { id })
}

// Shoot photo operations
export function getLocalShootPhotos(shootId: string): ShootPhoto[] {
  const result = db.getAllSync<any>('SELECT * FROM shoot_photos WHERE shoot_id = ? ORDER BY sequence_number', [shootId])
  return result.map(row => ({
    ...row,
    metadata: JSON.parse(row.metadata || '{}'),
  }))
}

export function saveLocalShootPhoto(photo: ShootPhoto & { local_uri?: string }) {
  const sql = `
    INSERT OR REPLACE INTO shoot_photos (
      id, shoot_id, gallery_image_id, shot_list_item_id, sequence_number,
      local_uri, metadata, upload_source, uploaded_at, created_at, synced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  
  db.runSync(sql, [
    photo.id,
    photo.shoot_id,
    photo.gallery_image_id || null,
    photo.shot_list_item_id || null,
    photo.sequence_number || null,
    (photo as any).local_uri || null,
    JSON.stringify(photo.metadata),
    photo.upload_source,
    photo.uploaded_at || null,
    photo.created_at,
    0
  ])
  
  addToSyncQueue('shoot_photo', photo.id, 'upsert', photo)
}

// Sync queue operations
export function addToSyncQueue(entityType: string, entityId: string, action: string, payload: any) {
  db.runSync(
    'INSERT INTO sync_queue (entity_type, entity_id, action, payload) VALUES (?, ?, ?, ?)',
    [entityType, entityId, action, JSON.stringify(payload)]
  )
}

export function getSyncQueue() {
  return db.getAllSync<any>('SELECT * FROM sync_queue ORDER BY id ASC LIMIT 50')
}

export function removeSyncQueueItem(id: number) {
  db.runSync('DELETE FROM sync_queue WHERE id = ?', [id])
}

export function clearSyncQueue() {
  db.runSync('DELETE FROM sync_queue')
}
