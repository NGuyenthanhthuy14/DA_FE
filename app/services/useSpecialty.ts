import { getSpecialtyBySlug, SpecialtyDetailResponse } from "@/apiRequest/specialty";
import { useEffect, useState } from "react";

export const useSpecialty = (slug: string) => {
	const [specialty, setSpecialty] = useState<SpecialtyDetailResponse | null>(null);

	const getSpecialtyDetail = async (slug: string) => {
		try {
			const res = await getSpecialtyBySlug(slug);
			setSpecialty(res);
		} catch (error) {
			console.error("Error fetching specialty detail:", error);
		}
	};

	useEffect(() => {
		getSpecialtyDetail(slug);
	}, [slug]);

	return { specialty, getSpecialtyDetail };
}