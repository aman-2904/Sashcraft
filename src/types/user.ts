export interface UserProfile {
  id?: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role?: 'customer' | 'admin' | 'superadmin';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserOrderEnquiry {
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
  address?: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'quoted' | 'approved' | 'completed';
  created_at: string;
}
