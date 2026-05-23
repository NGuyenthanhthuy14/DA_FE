import {
  AddressPayload,
  AddressesResponse,
  UpdateAddressPayload,
} from "@/app/types/api/address";
import { del, get, patch, post, put } from "./indext";

export const getAddresses = async (): Promise<AddressesResponse> => {
  return await get("/user/addresses");
};

export const createAddress = async (
  payload: AddressPayload,
): Promise<AddressesResponse> => {
  return await post("/user/addresses", payload);
};

export const updateAddress = async (
  addressId: string,
  payload: AddressPayload,
): Promise<AddressesResponse> => {
  return await put(`/user/addresses/${addressId}`, payload);
};

export const patchAddress = async (
  addressId: string,
  payload: UpdateAddressPayload,
): Promise<AddressesResponse> => {
  return await patch(`/user/addresses/${addressId}`, payload);
};

export const deleteAddress = async (
  addressId: string,
): Promise<AddressesResponse> => {
  return await del(`/user/addresses/${addressId}`);
};
