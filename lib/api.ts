import type { ApiResponse } from "@/lib/types";
import { getToken } from "@/lib/token";

/**
 * Base URL for the e-wallet API.
 * Configure via the `NEXT_PUBLIC_API_BASE_URL` environment variable; falls back
 * to the local Laravel backend (`http://localhost:8000/api`).
 */
export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

/**
 * Error thrown by {@link apiFetch} whenever the API responds with a non-2xx status.
 *
 * Carries the HTTP status code and any per-field validation errors returned by
 * the backend inside the standard response envelope.
 */
export class ApiError extends Error {
	/** The HTTP status code of the failed response. */
	readonly status: number;

	/** Field-level validation errors keyed by field name, when present. */
	readonly errors: Record<string, string[]> | undefined;

	/**
	 * @param status - The HTTP status code of the failed response.
	 * @param message - A human-readable error message.
	 * @param errors - Optional field-level validation errors from the response.
	 */
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

/**
 * Joins an endpoint path onto the configured {@link API_BASE_URL}.
 *
 * @param path - The endpoint path, with or without a leading slash (e.g. "/wallet").
 * @returns The absolute URL string.
 */
function buildUrl(path: string): string {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `${API_BASE_URL}${normalized}`;
}

/**
 * Safely parses a raw JSON response body.
 *
 * @param raw - The raw response text.
 * @returns The parsed JSON value.
 * @throws {ApiError} With status 500 when the body is not valid JSON.
 */
function parseJson<T>(raw: string): T {
	try {
		return JSON.parse(raw) as T;
	} catch {
		throw new ApiError(500, "Invalid response from server");
	}
}

/**
 * Sends a request to the e-wallet API and unwraps the standard response envelope.
 *
 * Automatically attaches the stored `Bearer` token (when available) and normalizes
 * error responses into an {@link ApiError}. The resolved value is the `data`
 * property of the API response envelope.
 *
 * @param path - The endpoint path relative to the API, e.g. "/wallet".
 * @param options - Standard `fetch` request options (method, body, etc.).
 * @returns The `data` value from the response envelope, typed as `T`.
 * @throws {ApiError} When the response is non-2xx or the body cannot be parsed.
 */
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
