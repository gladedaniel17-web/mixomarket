export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'client' | 'vendor' | 'admin';
export type VendorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'card' | 'mtn_momo' | 'airtel_money';
export type TryOnStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          preferred_language: 'fr' | 'en';
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          preferred_language?: 'fr' | 'en';
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          vendor_id: string;
          category_id: string;
          name_fr: string;
          name_en: string | null;
          slug: string;
          description_fr: string;
          description_en: string | null;
          base_price: number;
          sale_price: number | null;
          is_on_sale: boolean;
          is_featured: boolean;
          is_new_arrival: boolean;
          is_active: boolean;
          allows_tryon: boolean;
          tryon_category: 'top' | 'bottom' | 'full' | null;
          brand: string | null;
          average_rating: number;
          review_count: number;
          total_sold: number;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name_fr: string;
          name_en: string;
          slug: string;
          description_fr: string | null;
          description_en: string | null;
          icon_name: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          city: 'Brazzaville' | 'Pointe-Noire';
          zone_name: string;
          delivery_fee: number;
          estimated_hours_min: number;
          estimated_hours_max: number;
          is_active: boolean;
        };
      };
    };
  };
}
