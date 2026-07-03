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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_events: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          type: Database["public"]["Enums"]["lead_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          type: Database["public"]["Enums"]["lead_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          type?: Database["public"]["Enums"]["lead_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_flags: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          note: string | null
          reason: Database["public"]["Enums"]["flag_reason"]
          reporter_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          note?: string | null
          reason: Database["public"]["Enums"]["flag_reason"]
          reporter_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          note?: string | null
          reason?: Database["public"]["Enums"]["flag_reason"]
          reporter_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_flags_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_images: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          path: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          path: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          path?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category_id: string | null
          condition: Database["public"]["Enums"]["listing_condition"]
          cover_image_url: string | null
          created_at: string
          delivery_methods: string[]
          description: string
          id: string
          price_bs: number
          published_at: string | null
          rejection_reason: string | null
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
          zone: string | null
        }
        Insert: {
          category_id?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"]
          cover_image_url?: string | null
          created_at?: string
          delivery_methods?: string[]
          description?: string
          id?: string
          price_bs?: number
          published_at?: string | null
          rejection_reason?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
          zone?: string | null
        }
        Update: {
          category_id?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"]
          cover_image_url?: string | null
          created_at?: string
          delivery_methods?: string[]
          description?: string
          id?: string
          price_bs?: number
          published_at?: string | null
          rejection_reason?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          phone: string | null
          updated_at: string
          zone: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id: string
          phone?: string | null
          updated_at?: string
          zone?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      seller_verifications: {
        Row: {
          created_at: string
          id_document_path: string | null
          notes: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["verification_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id_document_path?: string | null
          notes?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id_document_path?: string | null
          notes?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      flag_reason: "fraud" | "prohibited" | "spam" | "other"
      lead_type: "view" | "contact_click" | "whatsapp_click" | "favorite"
      listing_condition: "new" | "like_new" | "good" | "fair"
      listing_status:
        | "draft"
        | "pending_review"
        | "published"
        | "paused"
        | "rejected"
        | "sold"
        | "archived"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      flag_reason: ["fraud", "prohibited", "spam", "other"],
      lead_type: ["view", "contact_click", "whatsapp_click", "favorite"],
      listing_condition: ["new", "like_new", "good", "fair"],
      listing_status: [
        "draft",
        "pending_review",
        "published",
        "paused",
        "rejected",
        "sold",
        "archived",
      ],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
