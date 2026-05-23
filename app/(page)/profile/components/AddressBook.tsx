"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { FormEvent, useEffect, useState } from "react";
import {
  LuCheck,
  LuMapPin,
  LuPencil,
  LuPlus,
  LuRefreshCw,
  LuStar,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { toast } from "sonner";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  patchAddress,
  updateAddress,
} from "@/apiRequest/address";
import {
  getGhnDistricts,
  getGhnProvinces,
  getGhnWards,
  type GhnDistrict,
  type GhnProvince,
  type GhnWard,
} from "@/apiRequest/ghn";
import type { AddressPayload, UserAddress } from "@/app/types/api/address";

type AddressForm = AddressPayload;

const EMPTY_FORM: AddressForm = {
  label: "",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  province_id: undefined,
  district: "",
  district_id: undefined,
  ward: "",
  ward_code: "",
  detail: "",
  is_default: false,
};

const normalizePhone = (phone: string) => phone.replace(/\D/g, "").slice(0, 12);
const normalizeNumber = (value?: number | string) => {
  if (value === undefined || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};
const normalizeName = (value?: string) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(tinh|thanh pho|tp\.?|quan|huyen|thi xa|phuong|xa|thi tran)\s+/i, "")
    .trim()
    .toLowerCase() || "";

function toForm(address?: UserAddress): AddressForm {
  if (!address) return EMPTY_FORM;

  return {
    label: address.label || "",
    fullName: address.fullName,
    phone: address.phone,
    address: address.address,
    city: address.city || "",
    province_id: address.province_id,
    district: address.district || "",
    district_id: address.district_id,
    ward: address.ward || "",
    ward_code: address.ward_code || "",
    detail: address.detail || "",
    is_default: address.is_default,
  };
}

interface AddressModalProps {
  address?: UserAddress | null;
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: AddressPayload) => Promise<void>;
}

function AddressModal({
  address,
  open,
  saving,
  onClose,
  onSubmit,
}: AddressModalProps) {
  const [form, setForm] = useState<AddressForm>(toForm(address || undefined));
  const [error, setError] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<GhnProvince[]>([]);
  const [districts, setDistricts] = useState<GhnDistrict[]>([]);
  const [wards, setWards] = useState<GhnWard[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [regionError, setRegionError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(toForm(address || undefined));
      setError(null);
      setRegionError(null);
    }
  }, [address, open]);

  useEffect(() => {
    if (!open) return;

    let ignore = false;
    setLoadingProvinces(true);
    getGhnProvinces()
      .then((data) => {
        if (!ignore) setProvinces(data);
      })
      .catch((fetchError: unknown) => {
        if (ignore) return;
        setRegionError(
          fetchError instanceof Error
            ? fetchError.message
            : "Không thể tải danh sách tỉnh/thành từ GHN"
        );
      })
      .finally(() => {
        if (!ignore) setLoadingProvinces(false);
      });

    return () => {
      ignore = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || form.province_id || !form.city || provinces.length === 0) return;

    const province = provinces.find(
      (item) => normalizeName(item.province_name) === normalizeName(form.city)
    );
    if (!province) return;

    setForm((current) => ({
      ...current,
      city: province.province_name,
      province_id: province.province_id,
    }));
  }, [form.city, form.province_id, open, provinces]);

  useEffect(() => {
    const provinceId = normalizeNumber(form.province_id);
    if (!open || !provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }

    let ignore = false;
    setLoadingDistricts(true);
    getGhnDistricts(provinceId)
      .then((data) => {
        if (!ignore) setDistricts(data);
      })
      .catch((fetchError: unknown) => {
        if (ignore) return;
        setRegionError(
          fetchError instanceof Error
            ? fetchError.message
            : "Không thể tải danh sách quận/huyện từ GHN"
        );
      })
      .finally(() => {
        if (!ignore) setLoadingDistricts(false);
      });

    return () => {
      ignore = true;
    };
  }, [form.province_id, open]);

  useEffect(() => {
    if (!open || form.district_id || !form.district || districts.length === 0) return;

    const district = districts.find(
      (item) => normalizeName(item.district_name) === normalizeName(form.district)
    );
    if (!district) return;

    setForm((current) => ({
      ...current,
      district: district.district_name,
      district_id: district.district_id,
    }));
  }, [districts, form.district, form.district_id, open]);

  useEffect(() => {
    const districtId = normalizeNumber(form.district_id);
    if (!open || !districtId) {
      setWards([]);
      return;
    }

    let ignore = false;
    setLoadingWards(true);
    getGhnWards(districtId)
      .then((data) => {
        if (!ignore) setWards(data);
      })
      .catch((fetchError: unknown) => {
        if (ignore) return;
        setRegionError(
          fetchError instanceof Error
            ? fetchError.message
            : "Không thể tải danh sách phường/xã từ GHN"
        );
      })
      .finally(() => {
        if (!ignore) setLoadingWards(false);
      });

    return () => {
      ignore = true;
    };
  }, [form.district_id, open]);

  useEffect(() => {
    if (!open || form.ward_code || !form.ward || wards.length === 0) return;

    const ward = wards.find(
      (item) => normalizeName(item.ward_name) === normalizeName(form.ward)
    );
    if (!ward) return;

    setForm((current) => ({
      ...current,
      ward: ward.ward_name,
      ward_code: ward.ward_code,
    }));
  }, [form.ward, form.ward_code, open, wards]);

  if (!open) return null;

  const setField = (field: keyof AddressForm, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: field === "phone" && typeof value === "string" ? normalizePhone(value) : value,
    }));
    setError(null);
  };

  const handleProvinceChange = (value: string) => {
    const province = provinces.find((item) => item.province_id === Number(value));
    setForm((current) => ({
      ...current,
      city: province?.province_name || "",
      province_id: province?.province_id,
      district: "",
      district_id: undefined,
      ward: "",
      ward_code: "",
    }));
    setDistricts([]);
    setWards([]);
    setError(null);
  };

  const handleDistrictChange = (value: string) => {
    const district = districts.find((item) => item.district_id === Number(value));
    setForm((current) => ({
      ...current,
      district: district?.district_name || "",
      district_id: district?.district_id,
      ward: "",
      ward_code: "",
    }));
    setWards([]);
    setError(null);
  };

  const handleWardChange = (value: string) => {
    const ward = wards.find((item) => item.ward_code === value);
    setForm((current) => ({
      ...current,
      ward: ward?.ward_name || "",
      ward_code: ward?.ward_code || "",
    }));
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: AddressPayload = {
      label: form.label?.trim() || "",
      fullName: form.fullName.trim(),
      phone: normalizePhone(form.phone),
      address: form.address.trim(),
      city: form.city?.trim() || "",
      province_id: normalizeNumber(form.province_id),
      district: form.district?.trim() || "",
      district_id: normalizeNumber(form.district_id),
      ward: form.ward?.trim() || "",
      ward_code: form.ward_code?.trim() || "",
      detail: form.detail?.trim() || "",
      is_default: Boolean(form.is_default),
    };

    if (payload.fullName.length < 2) {
      setError("Họ và tên phải có ít nhất 2 ký tự.");
      return;
    }

    if (payload.phone.length < 8) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    if (!payload.address) {
      setError("Vui lòng nhập địa chỉ.");
      return;
    }

    if (!payload.province_id || !payload.district_id || !payload.ward_code) {
      setError("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã.");
      return;
    }

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-amber-100 px-6 py-4">
          <h2 className="m-0 text-lg font-extrabold text-stone-800">
            {address ? "Sửa địa chỉ" : "Thêm địa chỉ"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <LuX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">
                Nhãn địa chỉ
              </span>
              <input
                value={form.label}
                onChange={(event) => setField("label", event.target.value)}
                placeholder="Nhà riêng, Công ty..."
                className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">
                Họ và tên
              </span>
              <input
                required
                value={form.fullName}
                onChange={(event) => setField("fullName", event.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">
                Số điện thoại
              </span>
              <input
                required
                inputMode="tel"
                maxLength={12}
                value={form.phone}
                onChange={(event) => setField("phone", event.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">
                Tỉnh/Thành phố
              </span>
              <select
                required
                value={form.province_id ?? ""}
                onChange={(event) => handleProvinceChange(event.target.value)}
                disabled={loadingProvinces}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white"
              >
                <option value="">
                  {loadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành"}
                </option>
                {provinces.map((province) => (
                  <option key={province.province_id} value={province.province_id}>
                    {province.province_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">
                Quận/Huyện
              </span>
              <select
                required
                value={form.district_id ?? ""}
                onChange={(event) => handleDistrictChange(event.target.value)}
                disabled={!form.province_id || loadingDistricts}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white"
              >
                <option value="">
                  {loadingDistricts ? "Đang tải..." : "Chọn quận/huyện"}
                </option>
                {districts.map((district) => (
                  <option key={district.district_id} value={district.district_id}>
                    {district.district_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">
                Phường/Xã
              </span>
              <select
                required
                value={form.ward_code ?? ""}
                onChange={(event) => handleWardChange(event.target.value)}
                disabled={!form.district_id || loadingWards}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white"
              >
                <option value="">
                  {loadingWards ? "Đang tải..." : "Chọn phường/xã"}
                </option>
                {wards.map((ward) => (
                  <option key={ward.ward_code} value={ward.ward_code}>
                    {ward.ward_name}
                  </option>
                ))}
              </select>
            </label>

          </div>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold text-stone-700">
              Địa chỉ
            </span>
            <input
              required
              value={form.address}
              onChange={(event) => setField("address", event.target.value)}
              placeholder="Số nhà, đường, khu vực..."
              className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold text-stone-700">
              Ghi chú chi tiết
            </span>
            <textarea
              rows={3}
              value={form.detail}
              onChange={(event) => setField("detail", event.target.value)}
              className="w-full resize-none rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white"
            />
          </label>

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-stone-700">
            <input
              type="checkbox"
              checked={Boolean(form.is_default)}
              onChange={(event) => setField("is_default", event.target.checked)}
              className="h-4 w-4 accent-orange-600"
            />
            Đặt làm địa chỉ mặc định
          </label>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {regionError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {regionError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuCheck className="text-base" />
              {saving ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddressBook() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<UserAddress | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAddresses();
      if (res.err !== 0 || !Array.isArray(res.data)) {
        throw new Error(res.mess || "Không thể tải sổ địa chỉ");
      }
      setAddresses(res.data);
    } catch (fetchError: unknown) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Không thể tải sổ địa chỉ";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openCreate = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const openEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: AddressPayload) => {
    setSaving(true);
    try {
      const res = editingAddress
        ? await updateAddress(editingAddress._id, payload)
        : await createAddress(payload);

      if (res.err !== 0 || !Array.isArray(res.data)) {
        throw new Error(res.mess || "Không thể lưu địa chỉ");
      }

      setAddresses(res.data);
      setModalOpen(false);
      toast.success(editingAddress ? "Cập nhật địa chỉ thành công" : "Thêm địa chỉ thành công");
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error ? submitError.message : "Không thể lưu địa chỉ";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await patchAddress(addressId, { is_default: true });
      if (res.err !== 0 || !Array.isArray(res.data)) {
        throw new Error(res.mess || "Không thể đặt mặc định");
      }
      setAddresses(res.data);
      toast.success("Đã đặt địa chỉ mặc định");
    } catch (defaultError: unknown) {
      const message =
        defaultError instanceof Error ? defaultError.message : "Không thể đặt mặc định";
      toast.error(message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddress) return;

    try {
      const res = await deleteAddress(deletingAddress._id);
      if (res.err !== 0 || !Array.isArray(res.data)) {
        throw new Error(res.mess || "Không thể xoá địa chỉ");
      }
      setAddresses(res.data);
      setDeletingAddress(null);
      toast.success("Đã xoá địa chỉ");
    } catch (deleteError: unknown) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Không thể xoá địa chỉ";
      toast.error(message);
    }
  };

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-xl font-extrabold text-stone-800">
            Sổ địa chỉ
          </h1>
          <p className="m-0 mt-1 text-sm text-stone-500">
            Quản lý địa chỉ nhận hàng cho các đơn tiếp theo.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchAddresses}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
          >
            <LuRefreshCw className="text-base" />
            Làm mới
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
          >
            <LuPlus className="text-base" />
            Thêm địa chỉ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl border border-amber-100 bg-white"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="m-0 text-sm text-red-600">{error}</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-amber-200 bg-white py-16 text-center shadow-sm">
          <LuMapPin className="mb-3 text-5xl text-stone-300" />
          <p className="m-0 text-sm font-medium text-stone-400">
            Bạn chưa có địa chỉ nào
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address._id}
              className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="m-0 text-base font-extrabold text-stone-800">
                      {address.label || "Địa chỉ"}
                    </h2>
                    {address.is_default && (
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="m-0 mt-2 text-sm font-semibold text-stone-700">
                    {address.fullName} · {address.phone}
                  </p>
                </div>
                <LuMapPin className="shrink-0 text-xl text-orange-500" />
              </div>

              <p className="m-0 mt-3 text-sm leading-6 text-stone-500">
                {[address.detail, address.address, address.ward, address.district, address.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {!address.is_default && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address._id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                  >
                    <LuStar className="text-sm" />
                    Đặt mặc định
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(address)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-600 transition hover:bg-stone-50"
                >
                  <LuPencil className="text-sm" />
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingAddress(address)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                >
                  <LuTrash2 className="text-sm" />
                  Xoá
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddressModal
        address={editingAddress}
        open={modalOpen}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {deletingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="m-0 text-lg font-extrabold text-stone-800">
              Xoá địa chỉ?
            </h2>
            <p className="m-0 mt-2 text-sm leading-6 text-stone-500">
              Bạn có chắc muốn xoá địa chỉ{" "}
              <span className="font-semibold text-stone-700">
                {deletingAddress.label || deletingAddress.address}
              </span>
              ? Thao tác này không thể hoàn tác.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAddress(null)}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Xoá địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
