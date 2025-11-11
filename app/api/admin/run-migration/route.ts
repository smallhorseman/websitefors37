import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseAdmin'
import { createLogger } from '@/lib/logger'
import { readFileSync } from 'fs'
import { join } from 'path'

const log = createLogger('api/admin/run-migration')

export async function POST(request: NextRequest) {
  try {
    // Get migration file name from request
    const { migrationFile } = await request.json()
    
    if (!migrationFile) {
      return NextResponse.json({ error: 'Migration file name required' }, { status: 400 })
    }

    // Read migration file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', migrationFile)
    let sql: string
    
    try {
      sql = readFileSync(migrationPath, 'utf-8')
    } catch (error: any) {
      log.error('Failed to read migration file', { error: error.message, migrationFile })
      return NextResponse.json({ error: 'Migration file not found' }, { status: 404 })
    }

    // Execute migration (split by semicolons for multiple statements)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    log.info('Executing migration', { migrationFile, statementsCount: statements.length })

    const results = []
    const errors = []

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement })
        
        if (error) {
          log.error(`Statement ${i + 1} failed`, { error: error.message, statement: statement.substring(0, 100) })
          errors.push({ statement: i + 1, error: error.message })
        } else {
          results.push({ statement: i + 1, success: true })
        }
      } catch (error: any) {
        log.error(`Exception on statement ${i + 1}`, { error: error.message })
        errors.push({ statement: i + 1, error: error.message })
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Migration completed with errors',
        results,
        errors
      }, { status: 207 }) // Multi-status
    }

    log.info('Migration completed successfully', { migrationFile })
    
    return NextResponse.json({
      success: true,
      message: 'Migration executed successfully',
      results
    })

  } catch (error: any) {
    log.error('Migration failed', { error: error.message })
    return NextResponse.json({
      error: 'Migration execution failed',
      details: error.message
    }, { status: 500 })
  }
}

// GET endpoint to list available migrations
export async function GET() {
  try {
    const { readdirSync } = await import('fs')
    const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
    
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()
      .reverse() // Most recent first
    
    return NextResponse.json({ migrations: files })
  } catch (error: any) {
    log.error('Failed to list migrations', { error: error.message })
    return NextResponse.json({ error: 'Failed to list migrations' }, { status: 500 })
  }
}
