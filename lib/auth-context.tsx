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

/**
 * Shape of the value exposed by the auth context.
 */
interface AuthContextValue {
	/** The currently authenticated user, or `null` when logged out. */
	user: UserResource | null;
	/** Whether a session is active (token stored or user restored). */
	isAuthenticated: boolean;
	/** `true` while the persisted session is being restored on mount. */
	isLoading: boolean;
	/** Registers a new user (does not log in). */
	register: (payload: RegisterPayload) => Promise<void>;
	/** Logs a user in, persisting the token and user. */
	login: (payload: LoginPayload) => Promise<void>;
	/** Logs the current user out, revoking and clearing the token. */
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provides authentication state to the component tree.
 *
 * Restores the persisted session (token + user) from localStorage on mount and
 * exposes `register`, `login`, and `logout` actions through `useAuth()`.
 *
 * @param children - Components that should be able to consume the auth context.
 */
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

	/**
	 * Registers a new user via the API.
	 * @param payload - The registration data.
	 */
	const handleRegister = useCallback(async (payload: RegisterPayload) => {
		await registerRequest(payload);
	}, []);

	/**
	 * Logs a user in, persisting the session straight after a successful call.
	 * @param payload - The login credentials.
	 */
	const handleLogin = useCallback(async (payload: LoginPayload) => {
		const response = await loginRequest(payload);
		persistLogin(response);
		setUser(getCurrentUser());
	}, []);

	/**
	 * Logs the user out, clearing the stored token and user.
	 */
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

/**
 * Returns the current authentication state and actions.
 *
 * Must be rendered inside an {@link AuthProvider}.
 *
 * @returns The auth context value (user, isAuthenticated, isLoading, and the
 *   register/login/logout actions).
 * @throws {Error} When used outside of an {@link AuthProvider}.
 */
export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}
