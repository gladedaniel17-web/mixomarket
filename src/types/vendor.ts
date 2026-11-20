export interface VendorProfile {
  id: string;
  businessName: string;
  businessDescription: string;
  phone: string;
  city: 'Brazzaville' | 'Pointe-Noire';
  address?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRate: number; // e.g. 10.00%
  createdAt: string;
}

export interface AdminAnalytics {
  totalRevenue: number; // in FCFA
  totalOrders: number;
  totalCustomers: number;
  activeVendors: number;
  pendingVendors: number;
  topProducts: {
    name: string;
    soldCount: number;
    revenue: number;
  }[];
  recentOrders: {
    orderNumber: string;
    customerName: string;
    city: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
}
