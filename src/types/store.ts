export type StoredImage = {
  url: string;
  path: string | null;
  alt?: string | null;
};

export type StoreSettings = {
  id: number;
  brandName: string;
  tagline: string;
  logoUrl: string | null;
  logoPath: string | null;
  whatsappNumber: string | null;
  instagramUrl: string | null;
  email: string | null;
  phone: string | null;
  announcementText: string | null;
  heroEyebrow: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroImageUrl: string | null;
  heroImagePath: string | null;
  heroImageAlt: string;
  institutionalText: string | null;
  footerText: string | null;
  privacyText: string | null;
  brandColor: string;
  blushColor: string;
  sageColor: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: CategoryIcon;
  tone: CategoryTone;
  imageUrl: string | null;
  imagePath: string | null;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryIcon =
  | "gift"
  | "notebook"
  | "package"
  | "sparkles"
  | "heart"
  | "star"
  | "ribbon";

export type CategoryTone = "blush" | "sage" | "sky" | "peach" | "sand";

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  storagePath: string | null;
  altText: string | null;
  sortOrder: number;
};

export type Product = {
  id: string;
  categoryId: string | null;
  category: Category | null;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  priceOnRequest: boolean;
  isCustomizable: boolean;
  customizationNotes: string | null;
  dimensions: string | null;
  materials: string | null;
  productionTime: string | null;
  minQuantity: number;
  mainImageUrl: string | null;
  mainImagePath: string | null;
  mainImageAlt: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
};

export type HomepageSection = {
  key: string;
  label: string;
  eyebrow: string | null;
  title: string | null;
  body: string | null;
  isVisible: boolean;
  sortOrder: number;
};

export type ProductWithCategory = Product;

export type StoreData = {
  settings: StoreSettings;
  sections: HomepageSection[];
  categories: Category[];
  products: Product[];
};

export type AdminProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: "admin" | "viewer";
};
