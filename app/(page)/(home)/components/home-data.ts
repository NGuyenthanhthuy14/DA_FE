export type FeaturedFood = {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
};

export type NearbyShop = {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  image: string;
  lat?: number;
  lng?: number;
};

export type HeroCategory = {
  id: number;
  name: string;
  description: string;
  amount: string;
};

export const featuredFoods: FeaturedFood[] = [
  {
    id: 1,
    name: "Phở bò Hà Nội",
    location: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=1200&auto=format&fit=crop",
    description: "Nước dùng đậm đà, bánh phở mềm và thịt bò thơm ngon.",
  },
  {
    id: 2,
    name: "Bún bò Huế",
    location: "Huế",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
    description: "Vị cay nồng đặc trưng, đậm bản sắc ẩm thực miền Trung.",
  },
  {
    id: 3,
    name: "Cao lầu Hội An",
    location: "Quảng Nam",
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=1200&auto=format&fit=crop",
    description: "Sợi mì dai ngon, ăn kèm rau sống và thịt xíu hấp dẫn.",
  },
];

export const nearbyShops: NearbyShop[] = [
  {
    id: 1,
    name: "Quán Bếp Việt",
    address: "Ba Vì, Hà Nội",
    distance: "1.2 km",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
    lat: 21.076,
    lng: 105.436,
  },
  {
    id: 2,
    name: "Góc Ẩm Thực Quê",
    address: "Sơn Tây, Hà Nội",
    distance: "2.4 km",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    lat: 21.138,
    lng: 105.505,
  },
  {
    id: 3,
    name: "Mộc Quán Đặc Sản",
    address: "Thạch Thất, Hà Nội",
    distance: "3.1 km",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
    lat: 21.03,
    lng: 105.64,
  },
];

export const heroCategories: HeroCategory[] = [
  {
    id: 1,
    name: "Đặc sản vùng miền",
    description: "Món đặc trưng từng tỉnh thành",
    amount: "120+",
  },
  {
    id: 2,
    name: "Món nước",
    description: "Phở, bún, miến, hủ tiếu",
    amount: "80+",
  },
  {
    id: 3,
    name: "Món nướng",
    description: "Đồ nướng than hoa hấp dẫn",
    amount: "65+",
  },
  {
    id: 4,
    name: "Quán gia đình",
    description: "Không gian ấm cúng gần bạn",
    amount: "50+",
  },
];

export const searchCategories = [
  "Đặc sản vùng miền",
  "Món nước",
  "Món nướng",
  "Đồ ăn sáng",
  "Quán gia đình",
  "Quán gần bạn",
];

export const mapPoints = [
  "Ba Vì",
  "Sơn Tây",
  "Thạch Thất",
  "Hòa Lạc",
  "Quốc Oai",
];
