export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string;
          created_at: string;
          created_by: string;
          expires_at: string;
          id: string;
          label: string | null;
          used_at: string | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          created_by: string;
          expires_at: string;
          id?: string;
          label?: string | null;
          used_at?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          created_by?: string;
          expires_at?: string;
          id?: string;
          label?: string | null;
          used_at?: string | null;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          area_sqm: number;
          bedrooms: number;
          city: string;
          created_at: string;
          description: string;
          id: string;
          photos: string[];
          price: number;
          published: boolean;
          title: string;
          updated_at: string;
        };
        Insert: {
          area_sqm: number;
          bedrooms: number;
          city: string;
          created_at?: string;
          description: string;
          id?: string;
          photos?: string[];
          price: number;
          published?: boolean;
          title: string;
          updated_at?: string;
        };
        Update: {
          area_sqm?: number;
          bedrooms?: number;
          city?: string;
          created_at?: string;
          description?: string;
          id?: string;
          photos?: string[];
          price?: number;
          published?: boolean;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
