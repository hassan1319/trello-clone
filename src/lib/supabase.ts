import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      boards: {
        Row: {
          id: string
          title: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          user_id?: string
          created_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          title: string
          board_id: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          board_id: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          board_id?: string
          position?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          list_id: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          list_id: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          list_id?: string
          position?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}