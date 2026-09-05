import type { ApiResponse } from "@/lib/types";
import { getToken } from "@/lib/token";

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
	readonly status: number;
	readonly errors: Record<string, string[]> | undefined;

	constructor(
		status: number,
		message: string,
		errors?: Record<string, string[]>,
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.errors = errors;
	}
}

function buildUrl(path: string): string {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `${API_BASE_URL}${normalized}`;
}

function parseJson<T>(raw: string): T {
	try {
		return JSON.parse(raw) as T;
	} catch {
		throw new ApiError(500, "Invalid response from server");
	}
}

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const token = getToken();
	const headers: Record<string, string> = {
		Accept: "application/json",
		"Content-Type": "application/json",
		...(options.headers as Record<string, string> | undefined),
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(buildUrl(path), {
		...options,
		headers,
	});

	const raw = await response.text();
	const body = parseJson<ApiResponse<T>>(raw);

	if (!response.ok) {
		throw new ApiError(
			response.status,
			body.message ?? "Request failed",
			body.errors,
		);
	}

	return (body.data as T) ?? (null as T);
}
