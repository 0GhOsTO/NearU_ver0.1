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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      allowed_email_domains: {
        Row: {
          active: boolean
          created_at: string
          domain: string
          id: string
          school_name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          domain: string
          id?: string
          school_name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          domain?: string
          id?: string
          school_name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          user_a: string
          user_a_last_read_at: string
          user_b: string
          user_b_last_read_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          user_a: string
          user_a_last_read_at?: string
          user_b: string
          user_b_last_read_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          user_a?: string
          user_a_last_read_at?: string
          user_b?: string
          user_b_last_read_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category: Database["public"]["Enums"]["listing_category"]
          condition: Database["public"]["Enums"]["listing_condition"]
          created_at: string
          description: string
          id: string
          image_url: string | null
          price_cents: number
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["listing_category"]
          condition: Database["public"]["Enums"]["listing_condition"]
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          price_cents: number
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["listing_category"]
          condition?: Database["public"]["Enums"]["listing_condition"]
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          price_cents?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: string | null
          banned_until: string | null
          bio: string | null
          completed_deals_count: number | null
          created_at: string
          date_of_birth: string | null
          display_name: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          general_coordinate: unknown
          id: string
          is_onboarded: boolean | null
          last_name: string | null
          number_of_reviews: number | null
          profile_photo_url: string | null
          role: string | null
          school_name: string | null
          stripe_account_id: string | null
          stripe_customer_id: string | null
          suspension_reason: string | null
          trust_score: number | null
          updated_at: string
          wallet_balance: number | null
        }
        Insert: {
          account_status?: string | null
          banned_until?: string | null
          bio?: string | null
          completed_deals_count?: number | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          general_coordinate?: unknown
          id: string
          is_onboarded?: boolean | null
          last_name?: string | null
          number_of_reviews?: number | null
          profile_photo_url?: string | null
          role?: string | null
          school_name?: string | null
          stripe_account_id?: string | null
          stripe_customer_id?: string | null
          suspension_reason?: string | null
          trust_score?: number | null
          updated_at?: string
          wallet_balance?: number | null
        }
        Update: {
          account_status?: string | null
          banned_until?: string | null
          bio?: string | null
          completed_deals_count?: number | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          general_coordinate?: unknown
          id?: string
          is_onboarded?: boolean | null
          last_name?: string | null
          number_of_reviews?: number | null
          profile_photo_url?: string | null
          role?: string | null
          school_name?: string | null
          stripe_account_id?: string | null
          stripe_customer_id?: string | null
          suspension_reason?: string | null
          trust_score?: number | null
          updated_at?: string
          wallet_balance?: number | null
        }
        Relationships: []
      }
      profiles_public: {
        Row: {
          approximate_location: unknown
          bio: string | null
          completed_deals_count: number | null
          display_name: string | null
          id: string
          number_of_reviews: number | null
          profile_photo_url: string | null
          school_name: string | null
          trust_score: number | null
        }
        Insert: {
          approximate_location?: unknown
          bio?: string | null
          completed_deals_count?: number | null
          display_name?: string | null
          id: string
          number_of_reviews?: number | null
          profile_photo_url?: string | null
          school_name?: string | null
          trust_score?: number | null
        }
        Update: {
          approximate_location?: unknown
          bio?: string | null
          completed_deals_count?: number | null
          display_name?: string | null
          id?: string
          number_of_reviews?: number | null
          profile_photo_url?: string | null
          school_name?: string | null
          trust_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_public_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_user_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          blocked_user_id: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          blocked_user_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_conversation_participant: {
        Args: { p_conversation: string }
        Returns: boolean
      }
      list_my_conversations: {
        Args: never
        Returns: {
          conversation_id: string
          last_message_at: string
          last_message_body: string
          other_user_id: string
          unread_count: number
        }[]
      }
      mark_conversation_read: {
        Args: { p_conversation: string }
        Returns: undefined
      }
      restrict_signup_to_allowed_email_domains: {
        Args: { event: Json }
        Returns: Json
      }
      set_profile_onboarding: {
        Args: {
          p_bio: string
          p_date_of_birth: string
          p_display_name: string
          p_gender: string
          p_lat: number
          p_lng: number
          p_photo_url: string
          p_school_name: string
        }
        Returns: undefined
      }
      start_conversation: { Args: { p_other: string }; Returns: string }
    }
    Enums: {
      listing_category:
        | "textbooks"
        | "electronics"
        | "furniture"
        | "clothing"
        | "sports"
        | "other"
      listing_condition: "new" | "like_new" | "good" | "fair"
      listing_status: "active" | "sold" | "removed"
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
    Enums: {
      listing_category: [
        "textbooks",
        "electronics",
        "furniture",
        "clothing",
        "sports",
        "other",
      ],
      listing_condition: ["new", "like_new", "good", "fair"],
      listing_status: ["active", "sold", "removed"],
    },
  },
} as const
