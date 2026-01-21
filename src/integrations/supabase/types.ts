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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      challenges: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          max_points: number
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          max_points?: number
          start_date?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          max_points?: number
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          downvotes: number | null
          id: string
          is_anonymous: boolean | null
          parent_id: string | null
          post_id: string
          upvotes: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_anonymous?: boolean | null
          parent_id?: string | null
          post_id: string
          upvotes?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          is_anonymous?: boolean | null
          parent_id?: string | null
          post_id?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          banner_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_global: boolean | null
          member_count: number | null
          name: string
          post_count: number | null
          school_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_global?: boolean | null
          member_count?: number | null
          name: string
          post_count?: number | null
          school_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_global?: boolean | null
          member_count?: number | null
          name?: string
          post_count?: number | null
          school_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communities_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string | null
          id: string
          joined_at: string | null
          profile_id: string | null
          role: string | null
        }
        Insert: {
          community_id?: string | null
          id?: string
          joined_at?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Update: {
          community_id?: string | null
          id?: string
          joined_at?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      elections: {
        Row: {
          created_at: string | null
          election_type: string | null
          end_date: string
          group_id: string | null
          id: string
          start_date: string
          status: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          election_type?: string | null
          end_date: string
          group_id?: string | null
          id?: string
          start_date: string
          status?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          election_type?: string | null
          end_date?: string
          group_id?: string | null
          id?: string
          start_date?: string
          status?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elections_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elections_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string | null
          id: string
          receiver_id: string | null
          sender_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          receiver_id?: string | null
          sender_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          receiver_id?: string | null
          sender_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          id: string
          profile_id_1: string | null
          profile_id_2: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id_1?: string | null
          profile_id_2?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id_1?: string | null
          profile_id_2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_profile_id_1_fkey"
            columns: ["profile_id_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_profile_id_2_fkey"
            columns: ["profile_id_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chats: {
        Row: {
          created_at: string
          grade_level: string | null
          id: string
          name: string
          school_id: string
        }
        Insert: {
          created_at?: string
          grade_level?: string | null
          id?: string
          name: string
          school_id: string
        }
        Update: {
          created_at?: string
          grade_level?: string | null
          id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_chats_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          contribution_score: number | null
          group_id: string | null
          id: string
          joined_at: string | null
          profile_id: string | null
          role: string | null
        }
        Insert: {
          contribution_score?: number | null
          group_id?: string | null
          id?: string
          joined_at?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Update: {
          contribution_score?: number | null
          group_id?: string | null
          id?: string
          joined_at?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          class_section: string | null
          created_at: string | null
          description: string | null
          grade_level: string | null
          id: string
          is_private: boolean | null
          leader_id: string | null
          member_count: number | null
          name: string
          school_id: string | null
          subject_code: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          class_section?: string | null
          created_at?: string | null
          description?: string | null
          grade_level?: string | null
          id?: string
          is_private?: boolean | null
          leader_id?: string | null
          member_count?: number | null
          name: string
          school_id?: string | null
          subject_code?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          class_section?: string | null
          created_at?: string | null
          description?: string | null
          grade_level?: string | null
          id?: string
          is_private?: boolean | null
          leader_id?: string | null
          member_count?: number | null
          name?: string
          school_id?: string | null
          subject_code?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "group_chats"
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
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          link_url: string | null
          profile_id: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link_url?: string | null
          profile_id?: string | null
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link_url?: string | null
          profile_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_votes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          comment_count: number | null
          community_id: string | null
          content: string
          content_type: string | null
          created_at: string
          downvotes: number | null
          group_id: string | null
          hot_score: number | null
          id: string
          image_urls: string[] | null
          is_anonymous: boolean | null
          is_pinned: boolean | null
          school_id: string | null
          title: string | null
          updated_at: string
          upvotes: number | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          comment_count?: number | null
          community_id?: string | null
          content: string
          content_type?: string | null
          created_at?: string
          downvotes?: number | null
          group_id?: string | null
          hot_score?: number | null
          id?: string
          image_urls?: string[] | null
          is_anonymous?: boolean | null
          is_pinned?: boolean | null
          school_id?: string | null
          title?: string | null
          updated_at?: string
          upvotes?: number | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          comment_count?: number | null
          community_id?: string | null
          content?: string
          content_type?: string | null
          created_at?: string
          downvotes?: number | null
          group_id?: string | null
          hot_score?: number | null
          id?: string
          image_urls?: string[] | null
          is_anonymous?: boolean | null
          is_pinned?: boolean | null
          school_id?: string | null
          title?: string | null
          updated_at?: string
          upvotes?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          class_section: string | null
          created_at: string
          display_name: string | null
          grade_level: string | null
          id: string
          is_anonymous_mode: boolean | null
          last_active_at: string | null
          preferred_language: string | null
          reputation_points: number | null
          school_id: string | null
          total_contributions: number | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          class_section?: string | null
          created_at?: string
          display_name?: string | null
          grade_level?: string | null
          id?: string
          is_anonymous_mode?: boolean | null
          last_active_at?: string | null
          preferred_language?: string | null
          reputation_points?: number | null
          school_id?: string | null
          total_contributions?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          class_section?: string | null
          created_at?: string
          display_name?: string | null
          grade_level?: string | null
          id?: string
          is_anonymous_mode?: boolean | null
          last_active_at?: string | null
          preferred_language?: string | null
          reputation_points?: number | null
          school_id?: string | null
          total_contributions?: number | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rater_id: string
          score: number
          target_id: string
          target_type: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rater_id: string
          score: number
          target_id: string
          target_type: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rater_id?: string
          score?: number
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      rivalries: {
        Row: {
          created_at: string
          id: string
          school_a_id: string
          school_b_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          school_a_id: string
          school_b_id: string
        }
        Update: {
          created_at?: string
          id?: string
          school_a_id?: string
          school_b_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_challenges: {
        Row: {
          challenge_id: string
          current_points: number
          id: string
          school_id: string
          updated_at: string
        }
        Insert: {
          challenge_id: string
          current_points?: number
          id?: string
          school_id: string
          updated_at?: string
        }
        Update: {
          challenge_id?: string
          current_points?: number
          id?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_challenges_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          location: string | null
          location_city: string | null
          location_country: string | null
          location_state: string | null
          metadata: Json | null
          name: string
          verified_status: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          location?: string | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          metadata?: Json | null
          name: string
          verified_status?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          location?: string | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          metadata?: Json | null
          name?: string
          verified_status?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          created_at: string
          id: string
          name: string
          school_id: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          school_id: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          school_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interests: {
        Row: {
          created_at: string | null
          id: string
          interest_tag: string
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interest_tag: string
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interest_tag?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_profile_id_fkey"
            columns: ["profile_id"]
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
