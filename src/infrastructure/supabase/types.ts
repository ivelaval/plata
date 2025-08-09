export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          name: string
          email: string
          password_hash: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          password_hash: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          password_hash?: string
          created_at?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          id: number
          user_id: number | null
          name: string
          type: string
          balance: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          name: string
          type: string
          balance: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          name?: string
          type?: string
          balance?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: number
          account_id: number | null
          amount: number
          type: string
          category: string
          description: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: number
          account_id?: number | null
          amount: number
          type: string
          category: string
          description?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: number
          account_id?: number | null
          amount?: number
          type?: string
          category?: string
          description?: string | null
          date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      assets: {
        Row: {
          id: number
          user_id: number | null
          name: string
          value: number
          type: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          name: string
          value: number
          type: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          name?: string
          value?: number
          type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      liabilities: {
        Row: {
          id: number
          user_id: number | null
          name: string
          amount: number
          type: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          name: string
          amount: number
          type: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          name?: string
          amount?: number
          type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "liabilities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      budgets: {
        Row: {
          id: number
          user_id: number | null
          category: string
          amount: number
          period: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          category: string
          amount: number
          period: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          category?: string
          amount?: number
          period?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cycles: {
        Row: {
          id: number
          user_id: number | null
          name: string
          start_date: string
          end_date: string
          recurring: boolean
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          name: string
          start_date: string
          end_date: string
          recurring?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          name?: string
          start_date?: string
          end_date?: string
          recurring?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cycles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}