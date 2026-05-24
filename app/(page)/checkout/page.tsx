"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { LuShoppingBag, LuLock } from "react-icons/lu";
import { toast } from "sonner";
import { useCart } from "@/app/hook/useCart";
import { calcSalePrice } from "@/app/store/slices/cartSlices";

import { selectUser } from "@/app/store/slices/userSlices";
import { selectAddress, setAddress } from "@/app/store/slices/addressSlice";
import type { AddressData } from "@/app/store/slices/addressSlice";
import type { AppDispatch } from "@/app/store";
import { createOrder } from "@/apiRequest/order";
import type { ShopOrderPayload } from "@/apiRequest/order";
import { getAddresses } from "@/apiRequest/address";
import { extractShippingFee, getShippingFee } from "@/apiRequest/shipping";
import { createZaloPayPayment } from "@/apiRequest/payment";
import type { UserAddress } from "@/app/types/api/address";
import CheckoutStepper from "./components/CheckoutStepper";
import CheckoutAddress from "./components/CheckoutAddress";
import CheckoutShopOrder from "./components/CheckoutShopOrder";
import CheckoutSummary from "./components/CheckoutSummary";
import CheckoutPayment from "./components/CheckoutPayment";
import CheckoutTrustBadges from "./components/CheckoutTrustBadges";
import OrderSuccessModal from "./components/OrderSuccessModal";
import EditAddressModal from "./components/EditAddressModal";
import { SHIPPING_OPTIONS } from "./components/CheckoutShopOrder";

// ── Estimated delivery label helper ─────────────────────
const DELIVERY_ESTIMATES = [
	"2 – 4 ngày",
	"2 – 5 ngày",
	"3 – 5 ngày",
	"2 – 4 ngày",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getZaloPayOrderUrl(response: any): string {
	return (
		response?.data?.order_url ||
		response?.data?.orderUrl ||
		response?.metadata?.order_url ||
		response?.metadata?.orderUrl ||
		response?.order_url ||
		response?.orderUrl ||
		""
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCreatedOrderId(response: any): string {
	const order =
		response?.data?.order ||
		response?.data?.data ||
		response?.data ||
		response?.metadata?.order ||
		response?.metadata;

	return order?._id || order?.id || order?.orderId || response?.orderId || "";
}

export default function CheckoutPage() {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const user = useSelector(selectUser);
	const userId = user?.id || user?._id;
	const addressData = useSelector(selectAddress);
	const { selectedItems, groupedByShop, removeSelected } = useCart();

	// Chỉ hiển thị shop có items được chọn
	const checkoutGroups = useMemo(() => {
		return groupedByShop
			.map((g) => ({
				...g,
				items: g.items.filter((i) => i.selected),
			}))
			.filter((g) => g.items.length > 0);
	}, [groupedByShop]);

	// State: shipping fee per shop
	const [shippingFeeMap, setShippingFeeMap] = useState<Record<string, number>>({});
	const [shippingLoadingMap, setShippingLoadingMap] = useState<Record<string, boolean>>({});
	const [shippingErrorMap, setShippingErrorMap] = useState<Record<string, string>>({});
	const getShippingFeeValue = (shopId: string) => shippingFeeMap[shopId] ?? 0;

	// State: notes per shop
	const [noteMap, setNoteMap] = useState<Record<string, string>>({});
	const handleNoteChange = (shopId: string, note: string) => {
		setNoteMap((prev) => ({ ...prev, [shopId]: note }));
	};

	// State: payment method
	const [paymentMethod, setPaymentMethod] = useState("cod");

	// State: success modal
	const [showSuccess, setShowSuccess] = useState(false);

	// State: loading khi đặt hàng
	const [placing, setPlacing] = useState(false);

	// Address modal
	const [showEditAddress, setShowEditAddress] = useState(false);
	const [showAddressSelect, setShowAddressSelect] = useState(false);
	const [addressBook, setAddressBook] = useState<UserAddress[]>([]);

	const toCheckoutAddress = (address: UserAddress): AddressData => ({
		fullName: address.fullName,
		phone: address.phone,
		address:
			address.address ||
			[address.detail, address.ward, address.district, address.city]
				.filter(Boolean)
				.join(", "),
		city: address.city || "",
		provinceId: address.province_id,
		district: address.district || "",
		districtId: address.district_id,
		ward: address.ward || "",
		wardCode: address.ward_code,
		detail: address.detail || "",
		isDefault: address.is_default,
	});

	useEffect(() => {
		if (!userId) return;

		let ignore = false;

		async function fetchAddressBook() {
			try {
				const res = await getAddresses();
				if (ignore || res.err !== 0 || !Array.isArray(res.data)) return;

				setAddressBook(res.data);

				if (!addressData.fullName) {
					const defaultAddress = res.data.find((item) => item.is_default) || res.data[0];
					if (defaultAddress) {
						dispatch(setAddress(toCheckoutAddress(defaultAddress)));
					}
				}
			} catch (error) {
				console.error("Fetch checkout addresses error:", error);
			}
		}

		fetchAddressBook();

		return () => {
			ignore = true;
		};
	}, [addressData.fullName, dispatch, userId]);

	// Dùng user info làm fallback nếu chưa có address lưu
	const displayAddress: AddressData = addressData.fullName
		? addressData
		: {
				fullName: user?.full_name ?? "Người dùng",
				phone: user?.phone ?? "0912 345 678",
				address: "101 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
				city: "Hà Nội",
				provinceId: undefined,
				district: "Quận Cầu Giấy",
				districtId: undefined,
				ward: "Phường Quan Hoa",
				wardCode: undefined,
				detail: "101 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
				isDefault: true,
			}

	const checkoutShopKey = checkoutGroups.map((group) => group.shopId).join("|");
	const shippingAddressReady = Boolean(
		displayAddress.districtId && displayAddress.wardCode,
	);

	useEffect(() => {
		const checkoutShopIds = checkoutShopKey.split("|").filter(Boolean);
		if (checkoutShopIds.length === 0) return;

		if (!displayAddress.districtId || !displayAddress.wardCode) {
			setShippingFeeMap({});
			setShippingLoadingMap({});
			setShippingErrorMap(
				Object.fromEntries(
					checkoutShopIds.map((shopId) => [
						shopId,
						"Cần chọn địa chỉ có quận/huyện và phường/xã",
					]),
				),
			);
			return;
		}

		let ignore = false;
		const shopIds = checkoutShopIds;

		setShippingLoadingMap(
			Object.fromEntries(shopIds.map((shopId) => [shopId, true])),
		);
		setShippingErrorMap({});

		async function fetchShippingFees() {
			const results = await Promise.all(
				shopIds.map(async (shopId) => {
					try {
						const response = await getShippingFee({
							from_district_id: displayAddress.districtId!,
							from_ward_code: displayAddress.wardCode!,
							to_district_id: displayAddress.districtId,
							to_ward_code: displayAddress.wardCode,
							shop_id: shopId,
						});
						const fee = extractShippingFee(response);

						if (fee === null) {
							return {
								shopId,
								fee: 0,
								error: response.mess || "Chưa tính được phí",
							};
						}

						return { shopId, fee, error: "" };
					} catch (error: unknown) {
						return {
							shopId,
							fee: 0,
							error: error instanceof Error ? error.message : "Không tính được phí",
						};
					}
				}),
			);

			if (ignore) return;

			setShippingFeeMap(
				Object.fromEntries(results.map((result) => [result.shopId, result.fee])),
			);
			setShippingErrorMap(
				Object.fromEntries(
					results
						.filter((result) => result.error)
						.map((result) => [result.shopId, result.error]),
				),
			);
			setShippingLoadingMap(
				Object.fromEntries(shopIds.map((shopId) => [shopId, false])),
			);
		}

		fetchShippingFees();

		return () => {
			ignore = true;
		};
	}, [checkoutShopKey, displayAddress.districtId, displayAddress.wardCode]);

	const handleSaveAddress = (data: AddressData) => {
		// Tự ghép trường address hiển thị từ detail + ward + district + city
		const composedAddress = [data.detail, data.ward, data.district, data.city]
			.filter(Boolean)
			.join(", ");
		dispatch(setAddress({ ...data, address: composedAddress }));
		setShowEditAddress(false);
	};

	const handleSelectAddress = (address: UserAddress) => {
		dispatch(setAddress(toCheckoutAddress(address)));
		setShowAddressSelect(false);
	};

	// ── Calculations ──
	const subtotal = selectedItems.reduce(
		(sum, item) => sum + calcSalePrice(item.price, item.discount) * item.quantity,
		0
	);

	const shippingTotal = checkoutGroups.reduce((sum, group) => {
		return sum + getShippingFeeValue(group.shopId);
	}, 0);

	const total = subtotal + shippingTotal;

	// ── Place order handler ──
	const handlePlaceOrder = async () => {
		if (placing) return;
		if (!userId) {
			toast.error("Vui lòng đăng nhập để đặt hàng");
			return;
		}

		if (!shippingAddressReady) {
			toast.error("Vui lòng chọn địa chỉ có quận/huyện và phường/xã");
			return;
		}
		if (Object.values(shippingLoadingMap).some(Boolean)) {
			toast.info("Đang tính phí vận chuyển, vui lòng chờ");
			return;
		}
		if (checkoutGroups.some((group) => shippingErrorMap[group.shopId])) {
			toast.error("Chưa thể tính phí vận chuyển cho đơn hàng");
			return;
		}

		setPlacing(true);
		try {
			// Xây dựng hoá đơn từng shop
			const shopOrdersPayload: ShopOrderPayload[] = checkoutGroups.map((group) => {
				const shippingOpt = SHIPPING_OPTIONS[0];
				const shippingPrice = getShippingFeeValue(group.shopId);

				const items = group.items.map((item) => {
					const salePrice = calcSalePrice(item.price, item.discount);
					return {
						product: item.productId,
						name: item.name,
						image: item.image,
						price: salePrice,
						quantity: item.quantity,
						itemTotal: salePrice * item.quantity,
					};
				});

				const productTotal = items.reduce((sum, i) => sum + i.itemTotal, 0);

				return {
					shop: group.shopId,
					shopName: group.shopName,
					items,
					shippingMethod: shippingOpt.id,
					shippingLabel: shippingOpt.label,
					shippingPrice,
					productTotal,
					shopTotal: productTotal + shippingPrice,
					note: noteMap[group.shopId] ?? "",
				};
			});

			const payload = {
				userId,
				shippingAddress: {
					fullName: displayAddress.fullName,
					phone: displayAddress.phone,
					address: displayAddress.address,
					city: displayAddress.city,
					province_id: displayAddress.provinceId,
					district: displayAddress.district,
					district_id: displayAddress.districtId,
					ward: displayAddress.ward,
					ward_code: displayAddress.wardCode,
					detail: displayAddress.detail,
				},
				shopOrders: shopOrdersPayload,
				paymentMethod,
				subtotal,
				shippingTotal,
				totalPrice: total,
			}

			if (paymentMethod === "online" || paymentMethod === "ewallet") {
				const orderResponse = await createOrder({
					...payload,
					paymentMethod: "online",
				});

				if (orderResponse.err !== 0) {
					toast.error(orderResponse.mess || "Đặt hàng thất bại");
					return;
				}

				const orderId = getCreatedOrderId(orderResponse);

				if (!orderId) {
					toast.error("Không tìm thấy mã đơn hàng để thanh toán ZaloPay");
					return;
				}

				const paymentResponse = await createZaloPayPayment({
					orderId,
					bankCode: "",
					redirectUrl: `${window.location.origin}/payment-result?orderId=${orderId}`,
				});

				const orderUrl = getZaloPayOrderUrl(paymentResponse);

				if (paymentResponse.err !== 0 || !orderUrl) {
					toast.error(
						paymentResponse.mess || "Không thể tạo thanh toán ZaloPay",
					);
					return;
				}

				window.location.href = orderUrl;
				return;
			}


			const response = await createOrder(payload);

			if (response.err === 0) {
				setShowSuccess(true);
			} else {
				toast.error(response.mess || "Đặt hàng thất bại");
			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Place order error:", error);
			toast.error(error?.message || "Có lỗi xảy ra khi đặt hàng");
		} finally {
			setPlacing(false);
		}
	};

	const handleViewOrders = () => {
		setShowSuccess(false);
		removeSelected(); // Xoá sản phẩm đã đặt khỏi giỏ hàng
		router.push("/profile"); // Navigate to order history
	};

	const handleCloseSuccess = () => {
		setShowSuccess(false);
		removeSelected(); // Xoá sản phẩm đã đặt khỏi giỏ hàng
		router.push("/");
	};

	// ── Empty checkout guard ──
	const isShippingCalculating = Object.values(shippingLoadingMap).some(Boolean);

	if (selectedItems.length === 0) {
		return (
			<div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20">
				<div className="text-center">
					<div className="mb-4 text-7xl">📦</div>
					<h2 className="mb-2 text-xl font-bold text-amber-900">
						Chưa có sản phẩm để thanh toán
					</h2>
					<p className="mb-6 text-sm text-stone-400">
						Hãy quay lại giỏ hàng và chọn sản phẩm muốn mua.
					</p>
					<Link
						href="/cart"
						className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 px-7 py-3 text-[15px] font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/35 no-underline"
					>
						<LuShoppingBag />
						Quay lại giỏ hàng
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 pb-16">
			{/* ── Page Header ── */}
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<span className="text-3xl">🛒</span>
					<h1 className="m-0 text-[22px] font-extrabold text-amber-900">
						Thanh toán
					</h1>
				</div>
				<div className="flex items-center gap-1.5 text-xs text-stone-400">
					<LuLock className="text-sm" />
					Thông tin của bạn được bảo mật
				</div>
			</div>

			{/* ── Stepper ── */}
			<div className="mb-8">
				<CheckoutStepper current={3} />
			</div>

			{/* ── Body: 2-column layout ── */}
			<div className="flex flex-col items-start gap-7 lg:flex-row">
				{/* ═══ LEFT COLUMN ═══ */}
				<div className="min-w-0 flex-1">
					{/* Section 1: Shipping Address */}
					<CheckoutAddress
						name={displayAddress.fullName}
						phone={displayAddress.phone}
						address={displayAddress.address}
						onEdit={() => setShowEditAddress(true)}
						onSelect={() => setShowAddressSelect(true)}
						hasAddressBook={addressBook.length > 0}
					/>

					{/* Section 2: Shop Orders */}
					<div className="mb-4">
						<h2 className="m-0 mb-3 text-base font-bold text-amber-900">
							2. Đơn hàng từ các shop
						</h2>
					</div>

					{checkoutGroups.map((group, idx) => (
						<CheckoutShopOrder
							key={group.shopId}
							shopId={group.shopId}
							shopName={group.shopName}
							items={group.items}
							estimatedDays={
								DELIVERY_ESTIMATES[idx % DELIVERY_ESTIMATES.length]
							}
							shippingFee={getShippingFeeValue(group.shopId)}
							shippingLoading={shippingLoadingMap[group.shopId]}
							shippingError={shippingErrorMap[group.shopId]}
							note={noteMap[group.shopId] ?? ""}
							onNoteChange={handleNoteChange}
						/>
					))}
				</div>

				{/* ═══ RIGHT COLUMN — Sidebar ═══ */}
				<aside className="top-[100px] flex w-full shrink-0 flex-col gap-5 lg:sticky lg:w-[340px]">
					{/* Order Summary */}
					<CheckoutSummary
						shopCount={checkoutGroups.length}
						subtotal={subtotal}
						shippingTotal={shippingTotal}
						total={total}
					/>

					{/* Payment Method */}
					<CheckoutPayment
						selected={paymentMethod}
						onChange={setPaymentMethod}
					/>

					{/* Place Order Button */}
					<button
						className={`w-full cursor-pointer rounded-xl border-none bg-gradient-to-br from-orange-600 to-orange-500 px-5 py-4 font-inherit text-base font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/40 active:translate-y-0 ${placing || isShippingCalculating ? 'opacity-60 pointer-events-none' : ''}`}
						type="button"
						onClick={handlePlaceOrder}
						disabled={placing || isShippingCalculating}
					>
						{placing ? '⏳ Đang xử lý...' : '🛒 Đặt hàng'}
					</button>

					<p className="m-0 text-center text-xs leading-relaxed text-stone-400">
						Bằng việc đặt hàng, bạn đồng ý với{" "}
						<Link
							href="#"
							className="font-medium text-orange-600 no-underline hover:underline"
						>
							Điều khoản sử dụng
						</Link>{" "}
						và{" "}
						<Link
							href="#"
							className="font-medium text-orange-600 no-underline hover:underline"
						>
							Chính sách bảo mật
						</Link>{" "}
						của chúng tôi.
					</p>

					{/* Trust Badges */}
					<CheckoutTrustBadges />
				</aside>
			</div>

			{/* Success Modal */}
			<OrderSuccessModal open={showSuccess} onClose={handleCloseSuccess} onViewOrders={handleViewOrders} />

			{/* Edit Address Modal */}
			<EditAddressModal
				open={showEditAddress}
				initialData={displayAddress}
				onClose={() => setShowEditAddress(false)}
				onSave={handleSaveAddress}
			/>

			{showAddressSelect && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="m-0 text-lg font-extrabold text-stone-800">
								Chọn địa chỉ nhận hàng
							</h2>
							<button
								type="button"
								onClick={() => setShowAddressSelect(false)}
								className="rounded-lg px-3 py-1.5 text-sm font-bold text-stone-500 transition hover:bg-stone-100"
							>
								Đóng
							</button>
						</div>

						<div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
							{addressBook.map((address) => {
								const isSelected =
									displayAddress.fullName === address.fullName &&
									displayAddress.phone === address.phone &&
									displayAddress.address === address.address;

								return (
									<button
										key={address._id}
										type="button"
										onClick={() => handleSelectAddress(address)}
										className={`w-full rounded-xl border p-4 text-left transition ${
											isSelected
												? "border-orange-400 bg-orange-50"
												: "border-amber-200 bg-white hover:border-orange-300 hover:bg-amber-50/50"
										}`}
									>
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-sm font-extrabold text-stone-800">
												{address.label || "Địa chỉ"}
											</span>
											{address.is_default && (
												<span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
													Mặc định
												</span>
											)}
										</div>
										<p className="m-0 mt-2 text-sm font-semibold text-stone-700">
											{address.fullName} · {address.phone}
										</p>
										<p className="m-0 mt-1 text-sm leading-6 text-stone-500">
											{[
												address.detail,
												address.address,
												address.ward,
												address.district,
												address.city,
											]
												.filter(Boolean)
												.join(", ")}
										</p>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
