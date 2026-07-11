export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          username: string | null;
          role: string;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          location: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          username?: string | null;
          role?: string;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          username?: string | null;
          role?: string;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      creators: {
        Row: {
          id: string;
          profile_id: string | null;
          display_name: string;
          email: string | null;
          role_title: string | null;
          bio: string | null;
          avatar_url: string | null;
          rating: number;
          response_time: string;
          completed_projects: number;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          display_name: string;
          email?: string | null;
          role_title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          rating?: number;
          response_time?: string;
          completed_projects?: number;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          display_name?: string;
          email?: string | null;
          role_title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          rating?: number;
          response_time?: string;
          completed_projects?: number;
          is_verified?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "creators_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      templates: {
        Row: {
          id: string;
          creator_id: string | null;
          slug: string;
          title: string;
          category: string;
          price: number;
          short_description: string | null;
          full_description: string | null;
          tools: string[];
          tags: string[];
          features: string[];
          pages_included: string[];
          best_for: string[];
          preview_type: string | null;
          preview_image_url: string | null;
          live_preview_url: string | null;
          fit_score: number;
          rating: number;
          status: string;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id?: string | null;
          slug: string;
          title: string;
          category: string;
          price?: number;
          short_description?: string | null;
          full_description?: string | null;
          tools?: string[];
          tags?: string[];
          features?: string[];
          pages_included?: string[];
          best_for?: string[];
          preview_type?: string | null;
          preview_image_url?: string | null;
          live_preview_url?: string | null;
          fit_score?: number;
          rating?: number;
          status?: string;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string | null;
          slug?: string;
          title?: string;
          category?: string;
          price?: number;
          short_description?: string | null;
          full_description?: string | null;
          tools?: string[];
          tags?: string[];
          features?: string[];
          pages_included?: string[];
          best_for?: string[];
          preview_type?: string | null;
          preview_image_url?: string | null;
          live_preview_url?: string | null;
          fit_score?: number;
          rating?: number;
          status?: string;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "templates_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "creators";
            referencedColumns: ["id"];
          },
        ];
      };
      website_requests: {
        Row: {
          id: string;
          template_id: string | null;
          creator_id: string | null;
          buyer_id: string | null;
          name: string;
          email: string;
          business_type: string | null;
          budget: string | null;
          website_style: string | null;
          message: string;
          request_type: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id?: string | null;
          creator_id?: string | null;
          buyer_id?: string | null;
          name: string;
          email: string;
          business_type?: string | null;
          budget?: string | null;
          website_style?: string | null;
          message: string;
          request_type?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string | null;
          creator_id?: string | null;
          buyer_id?: string | null;
          name?: string;
          email?: string;
          business_type?: string | null;
          budget?: string | null;
          website_style?: string | null;
          message?: string;
          request_type?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "website_requests_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "website_requests_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "creators";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "website_requests_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          },
        ];
      };
      saved_templates: {
        Row: {
          id: string;
          user_id: string;
          template_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_templates_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_templates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      template_reviews: {
        Row: {
          id: string;
          template_id: string;
          reviewer_name: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          reviewer_name?: string | null;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string;
          reviewer_name?: string | null;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "template_reviews_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "templates";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type CreatorRow = Database["public"]["Tables"]["creators"]["Row"];
export type TemplateRow = Database["public"]["Tables"]["templates"]["Row"];
export type WebsiteRequestRow =
  Database["public"]["Tables"]["website_requests"]["Row"];
