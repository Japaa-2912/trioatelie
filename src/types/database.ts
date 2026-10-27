export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "admin" | "viewer";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  tone: string;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number | null;
  price_on_request: boolean;
  is_customizable: boolean;
  customization_notes: string | null;
  dimensions: string | null;
  materials: string | null;
  production_time: string | null;
  min_quantity: number;
  main_image_url: string | null;
  main_image_path: string | null;
  main_image_alt: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  url: string;
  storage_path: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

export type StoreSettingsRow = {
  id: number;
  brand_name: string;
  tagline: string;
  logo_url: string | null;
  logo_path: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  email: string | null;
  phone: string | null;
  announcement_text: string | null;
  hero_eyebrow: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_primary_cta: string | null;
  hero_secondary_cta: string | null;
  hero_image_url: string | null;
  hero_image_path: string | null;
  hero_image_alt: string | null;
  institutional_text: string | null;
  footer_text: string | null;
  privacy_text: string | null;
  brand_color: string;
  blush_color: string;
  sage_color: string;
  created_at: string;
  updated_at: string;
};

export type HomepageSectionRow = {
  key: string;
  label: string;
  eyebrow: string | null;
  title: string | null;
  body: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ForeignKey = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDefinition<Row, Insert, Update, Relationships extends ForeignKey[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<
        ProfileRow,
        {
          id: string;
          full_name?: string | null;
          role?: AppRole;
          created_at?: string;
          updated_at?: string;
        },
        {
          full_name?: string | null;
          role?: AppRole;
          updated_at?: string;
        },
        [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ]
      >;
      categories: TableDefinition<
        CategoryRow,
        {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string;
          tone?: string;
          image_url?: string | null;
          image_path?: string | null;
          sort_order?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string;
          tone?: string;
          image_url?: string | null;
          image_path?: string | null;
          sort_order?: number;
          is_featured?: boolean;
          is_active?: boolean;
          updated_at?: string;
        }
      >;
      products: TableDefinition<
        ProductRow,
        {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          price?: number | null;
          price_on_request?: boolean;
          is_customizable?: boolean;
          customization_notes?: string | null;
          dimensions?: string | null;
          materials?: string | null;
          production_time?: string | null;
          min_quantity?: number;
          main_image_url?: string | null;
          main_image_path?: string | null;
          main_image_alt?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        },
        {
          category_id?: string | null;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          price?: number | null;
          price_on_request?: boolean;
          is_customizable?: boolean;
          customization_notes?: string | null;
          dimensions?: string | null;
          materials?: string | null;
          production_time?: string | null;
          min_quantity?: number;
          main_image_url?: string | null;
          main_image_path?: string | null;
          main_image_alt?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          updated_at?: string;
        },
        [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ]
      >;
      product_images: TableDefinition<
        ProductImageRow,
        {
          id?: string;
          product_id: string;
          url: string;
          storage_path?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        },
        {
          product_id?: string;
          url?: string;
          storage_path?: string | null;
          alt_text?: string | null;
          sort_order?: number;
        },
        [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ]
      >;
      store_settings: TableDefinition<
        StoreSettingsRow,
        {
          id?: number;
          brand_name?: string;
          tagline?: string;
          logo_url?: string | null;
          logo_path?: string | null;
          whatsapp_number?: string | null;
          instagram_url?: string | null;
          email?: string | null;
          phone?: string | null;
          announcement_text?: string | null;
          hero_eyebrow?: string | null;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          hero_primary_cta?: string | null;
          hero_secondary_cta?: string | null;
          hero_image_url?: string | null;
          hero_image_path?: string | null;
          hero_image_alt?: string | null;
          institutional_text?: string | null;
          footer_text?: string | null;
          privacy_text?: string | null;
          brand_color?: string;
          blush_color?: string;
          sage_color?: string;
          created_at?: string;
          updated_at?: string;
        },
        {
          brand_name?: string;
          tagline?: string;
          logo_url?: string | null;
          logo_path?: string | null;
          whatsapp_number?: string | null;
          instagram_url?: string | null;
          email?: string | null;
          phone?: string | null;
          announcement_text?: string | null;
          hero_eyebrow?: string | null;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          hero_primary_cta?: string | null;
          hero_secondary_cta?: string | null;
          hero_image_url?: string | null;
          hero_image_path?: string | null;
          hero_image_alt?: string | null;
          institutional_text?: string | null;
          footer_text?: string | null;
          privacy_text?: string | null;
          brand_color?: string;
          blush_color?: string;
          sage_color?: string;
          updated_at?: string;
        }
      >;
      homepage_sections: TableDefinition<
        HomepageSectionRow,
        {
          key: string;
          label: string;
          eyebrow?: string | null;
          title?: string | null;
          body?: string | null;
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        },
        {
          label?: string;
          eyebrow?: string | null;
          title?: string | null;
          body?: string | null;
          is_visible?: boolean;
          sort_order?: number;
          updated_at?: string;
        }
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
