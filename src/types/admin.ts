export interface AdminUser {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'superadmin';
  passkeyVerified: boolean;
  createdAt?: string;
  lastSignIn?: string;
}

export interface CustomerEnquiry {
  id: string;
  reference_id: string;
  product_name: string;
  variant: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customer_name: string;
  phone: string;
  email: string;
  organization?: string;
  event_date?: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'quoted' | 'approved' | 'completed';
  created_at: string;
}

export interface AdminProductOverride {
  id: string;
  slug: string;
  title: string;
  inStock: boolean;
  withoutLaceActual: number;
  withoutLaceDiscounted: number;
  withLaceActual: number;
  withLaceDiscounted: number;
  lastUpdated: string;
}
