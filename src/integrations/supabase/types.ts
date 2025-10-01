export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bot_accounts: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      bot_messages: {
        Row: {
          created_at: string
          id: string
          is_triggered: boolean | null
          message_id: string | null
          person_sent: string
          person_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_triggered?: boolean | null
          message_id?: string | null
          person_sent: string
          person_text: string
        }
        Update: {
          created_at?: string
          id?: string
          is_triggered?: boolean | null
          message_id?: string | null
          person_sent?: string
          person_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_messages_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "user_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data: {
        Row: {
          close: number | null
          created_at: string
          date: string
          high: number | null
          id: string
          low: number | null
          open: number | null
          performance_id: string | null
          portfolio_id: string | null
          return: number | null
          user_performance_id: string | null
          user_profile: string | null
          user_trading_id: string | null
          user_updated: string | null
          volume: number | null
          vwap: number | null
        }
        Insert: {
          close?: number | null
          created_at?: string
          date: string
          high?: number | null
          id?: string
          low?: number | null
          open?: number | null
          performance_id?: string | null
          portfolio_id?: string | null
          return?: number | null
          user_performance_id?: string | null
          user_profile?: string | null
          user_trading_id?: string | null
          user_updated?: string | null
          volume?: number | null
          vwap?: number | null
        }
        Update: {
          close?: number | null
          created_at?: string
          date?: string
          high?: number | null
          id?: string
          low?: number | null
          open?: number | null
          performance_id?: string | null
          portfolio_id?: string | null
          return?: number | null
          user_performance_id?: string | null
          user_profile?: string | null
          user_trading_id?: string | null
          user_updated?: string | null
          volume?: number | null
          vwap?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_data_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_data_user_profile_fkey"
            columns: ["user_profile"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_data_user_trading_id_fkey"
            columns: ["user_trading_id"]
            isOneToOne: false
            referencedRelation: "user_portfolio_trading"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          feed_two_id: string | null
          id: string
          is_read: boolean | null
          message: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feed_two_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          feed_two_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_packages: {
        Row: {
          available_access: string[] | null
          created_at: string
          description: string | null
          duration_weeks: number | null
          id: string
          is_active: boolean | null
          price: number
          updated_at: string
        }
        Insert: {
          available_access?: string[] | null
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          price: number
          updated_at?: string
        }
        Update: {
          available_access?: string[] | null
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          created_at: string
          description: string | null
          id: string
          portfolio_name: string
          total_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          portfolio_name: string
          total_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          portfolio_name?: string
          total_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_embeddings: {
        Row: {
          created_at: string
          embedding: string | null
          id: string
          model_name: string | null
          multi_index: number[] | null
          profile_embeddings: string | null
          single_index: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          embedding?: string | null
          id?: string
          model_name?: string | null
          multi_index?: number[] | null
          profile_embeddings?: string | null
          single_index?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          embedding?: string | null
          id?: string
          model_name?: string | null
          multi_index?: number[] | null
          profile_embeddings?: string | null
          single_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles_user_form: {
        Row: {
          bid: string | null
          created_at: string
          id: string
          portfolio_id: string | null
          sub_form: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bid?: string | null
          created_at?: string
          id?: string
          portfolio_id?: string | null
          sub_form?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bid?: string | null
          created_at?: string
          id?: string
          portfolio_id?: string | null
          sub_form?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_form_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_messages: {
        Row: {
          created_at: string
          created_name: string | null
          id: string
          message_text: string
          person_sent: string
          question_answer: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          created_name?: string | null
          id?: string
          message_text: string
          person_sent: string
          question_answer?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          created_name?: string | null
          id?: string
          message_text?: string
          person_sent?: string
          question_answer?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_payments: {
        Row: {
          created_at: string
          id: string
          partner_id: string | null
          payment_hash: string | null
          period: number | null
          status: string | null
          transaction_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          partner_id?: string | null
          payment_hash?: string | null
          period?: number | null
          status?: string | null
          transaction_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          partner_id?: string | null
          payment_hash?: string | null
          period?: number | null
          status?: string | null
          transaction_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_payments_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_portfolio_trading: {
        Row: {
          created_at: string
          followed_since: string | null
          follower_drive: string | null
          id: string
          portfolio_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          followed_since?: string | null
          follower_drive?: string | null
          id?: string
          portfolio_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          followed_since?: string | null
          follower_drive?: string | null
          id?: string
          portfolio_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolio_trading_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_portfolio_trading_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_embeddings: {
        Row: {
          create_name: string | null
          created_at: string
          embedding: string | null
          id: string
          member_date: string | null
          message_id: string | null
          model_name: string | null
          session_id: string | null
          updated_at: string
          user_name: string | null
          user_profile: string | null
        }
        Insert: {
          create_name?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          member_date?: string | null
          message_id?: string | null
          model_name?: string | null
          session_id?: string | null
          updated_at?: string
          user_name?: string | null
          user_profile?: string | null
        }
        Update: {
          create_name?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          member_date?: string | null
          message_id?: string | null
          model_name?: string | null
          session_id?: string | null
          updated_at?: string
          user_name?: string | null
          user_profile?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_embeddings_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "user_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_embeddings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_embeddings_user_profile_fkey"
            columns: ["user_profile"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_state: string | null
          activated_at: string | null
          amount_code: number | null
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          preferred_includes: string[] | null
          primary_name: string | null
          telegram_code: string | null
          updated_at: string
          updated_code: string | null
        }
        Insert: {
          account_state?: string | null
          activated_at?: string | null
          amount_code?: number | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean | null
          preferred_includes?: string[] | null
          primary_name?: string | null
          telegram_code?: string | null
          updated_at?: string
          updated_code?: string | null
        }
        Update: {
          account_state?: string | null
          activated_at?: string | null
          amount_code?: number | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          preferred_includes?: string[] | null
          primary_name?: string | null
          telegram_code?: string | null
          updated_at?: string
          updated_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
