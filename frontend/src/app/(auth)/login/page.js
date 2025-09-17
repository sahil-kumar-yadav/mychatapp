"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "../components/LoginPage";
import { useAuthStore } from "@/useAuthStore";

export default function Login() {
	const { authUser } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (authUser) {
			router.replace("/");
		}
	}, [authUser, router]);

	return <LoginPage />;
}
