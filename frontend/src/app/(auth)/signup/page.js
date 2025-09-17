"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignUpPage from "../components/SignupPage";
import { useAuthStore } from "@/store/useAuthStore";

export default function Signup() {
	const { authUser } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (authUser) {
			router.replace("/");
		}
	}, [authUser, router]);

	return <SignUpPage />;
}
