export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  priceOverride?: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn?: string;
  categorySlug: string;
  categoryNameFr: string;
  descriptionFr: string;
  basePrice: number; // FCFA
  salePrice?: number | null; // FCFA
  isOnSale: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  allowsTryOn: boolean;
  tryOnCategory?: 'top' | 'bottom' | 'full';
  brand?: string;
  vendorName: string;
  vendorCity: 'Brazzaville' | 'Pointe-Noire';
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  reviews?: Review[];
}

export interface Category {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  iconName: string;
  productCount: number;
  featuredImageUrl?: string;
}

export interface FilterState {
  categorySlug?: string;
  city?: 'Brazzaville' | 'Pointe-Noire' | 'all';
  minPrice?: number;
  maxPrice?: number;
  onSaleOnly?: boolean;
  tryOnOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'newest';
}
