"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import type { ReactNode } from "react";
import {
	clearCurrentUser,
	getCurrentUser,
	isAuthenticated,
	login as loginRequest,
	logout as logoutRequest,
	persistLogin,
	register as registerRequest,
} from "@/lib/auth";
import type { LoginPayload, RegisterPayload } from "@/lib/auth";
import type { UserResource } from "@/lib/types";

interface AuthContextValue {
	user: UserResource | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	register: (payload: RegisterPayload) => Promise<void>;
	login: (payload: LoginPayload) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserResource | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const mountedRef = useRef(false);

	useEffect(() => {
		if (!mountedRef.current) {
			mountedRef.current = true;
			setUser(getCurrentUser());
			setIsLoading(false);
		}
	}, []);

	const handleRegister = useCallback(async (payload: RegisterPayload) => {
		await registerRequest(payload);
	}, []);

	const handleLogin = useCallback(async (payload: LoginPayload) => {
		const response = await loginRequest(payload);
		persistLogin(response);
		setUser(getCurrentUser());
	}, []);

	const handleLogout = useCallback(async () => {
		await logoutRequest();
		clearCurrentUser();
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: isAuthenticated() || user !== null,
				isLoading,
				register: handleRegister,
				login: handleLogin,
				logout: handleLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}
