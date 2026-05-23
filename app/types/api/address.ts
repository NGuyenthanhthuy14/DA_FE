export interface UserAddress {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  detail: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddressPayload {
  label?: string;
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  district?: string;
  ward?: string;
  detail?: string;
  is_default?: boolean;
}

export type UpdateAddressPayload = Partial<AddressPayload>;

export interface AddressesResponse {
  err: number;
  mess: string;
  data: UserAddress[] | null;
}
