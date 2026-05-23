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
import { createZaloPayPayment } from "@/apiRequest/payment";
import {
	createPaymentOrderId,
	savePendingZaloPayOrder,
} from "@/app/utils/zalopayCheckout";
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

	// State: shipping per shop
	const [shippingMap, setShippingMap] = useState<Record<string, string>>({});
	const getShipping = (shopId: string) => shippingMap[shopId] ?? "standard";
	const handleShippingChange = (shopId: string, shippingId: string) => {
		setShippingMap((prev) => ({ ...prev, [shopId]: shippingId }));
	};

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
		district: address.district || "",
		ward: address.ward || "",
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
				district: "Quận Cầu Giấy",
				ward: "Phường Quan Hoa",
				detail: "101 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
				isDefault: true,
			};

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
		const shippingId = getShipping(group.shopId);
		const opt =
			SHIPPING_OPTIONS.find((o) => o.id === shippingId) ?? SHIPPING_OPTIONS[0];
		return sum + opt.price;
	}, 0);

	const total = subtotal + shippingTotal;

	// ── Place order handler ──
	const handlePlaceOrder = async () => {
		if (placing) return;
		if (!userId) {
			toast.error("Vui lòng đăng nhập để đặt hàng");
			return;
		}

		setPlacing(true);
		try {
			// Xây dựng hoá đơn từng shop
			const shopOrdersPayload: ShopOrderPayload[] = checkoutGroups.map((group) => {
				const shippingId = getShipping(group.shopId);
				const shippingOpt = SHIPPING_OPTIONS.find((o) => o.id === shippingId) ?? SHIPPING_OPTIONS[0];

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
					shippingPrice: shippingOpt.price,
					productTotal,
					shopTotal: productTotal + shippingOpt.price,
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
					district: displayAddress.district,
					ward: displayAddress.ward,
					detail: displayAddress.detail,
				},
				shopOrders: shopOrdersPayload,
				paymentMethod,
				subtotal,
				shippingTotal,
				totalPrice: total,
			};

			if (paymentMethod === "online" || paymentMethod === "ewallet") {
				const paymentOrderId = createPaymentOrderId();
				const redirectUrl = `${window.location.origin}/payment-result?checkoutOrderId=${paymentOrderId}`;
				const paymentResponse = await createZaloPayPayment({
					orderId: paymentOrderId,
					bankCode: "",
					redirectUrl,
				});

				const orderUrl = getZaloPayOrderUrl(paymentResponse);

				if (paymentResponse.err !== 0 || !orderUrl) {
					toast.error(
						paymentResponse.mess || "Không thể tạo thanh toán ZaloPay",
					);
					return;
				}

				savePendingZaloPayOrder({
					paymentOrderId,
					orderPayload: {
						...payload,
						paymentMethod: "online",
					},
				});

				window.location.href = orderUrl;
				return;
			}

			const response = await createOrder(payload);

			if (response.err === 0) {
				if (paymentMethod === "online" || paymentMethod === "ewallet") {
					const orderId = getCreatedOrderId(response);

					if (!orderId) {
						toast.error("Không tìm thấy mã đơn hàng để thanh toán ZaloPay");
						return;
					}

					const paymentResponse = await createZaloPayPayment({
						orderId,
						bankCode: "",
						redirectUrl: `${window.location.origin}/payment-result`,
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

				setShowSuccess(true);
			} else {
				toast.error(response.mess || "Đặt hàng thất bại");
			}
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
							selectedShipping={getShipping(group.shopId)}
							onShippingChange={handleShippingChange}
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
						className={`w-full cursor-pointer rounded-xl border-none bg-gradient-to-br from-orange-600 to-orange-500 px-5 py-4 font-inherit text-base font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/40 active:translate-y-0 ${placing ? 'opacity-60 pointer-events-none' : ''}`}
						type="button"
						onClick={handlePlaceOrder}
						disabled={placing}
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
