/**
 * Standard envelope returned by every API endpoint:
 * `{ status, message, data?, errors? }`.
 */
export interface ApiResponse<T> {
  /** Whether the request succeeded. */
  status: boolean;
  /** Human-readable message describing the outcome. */
  message: string;
  /** The response payload, when present. */
  data?: T;
  /** Field-level validation errors keyed by field name, when present. */
  errors?: Record<string, string[]>;
}

/**
 * Wrapper for API payloads that nest their content under a `data` key
 * (double-nested responses, e.g. wallet and topup/transfer resources).
 */
export interface DataEnvelope<T> {
  data: T;
}

/**
 * A JSON:API-style resource object.
 */
export interface Resource<TAttributes = Record<string, unknown>> {
  /** The resource identifier (string-form UUID). */
  id: string;
  /** The resource type, e.g. `"users"`, `"wallets"`, or `"transactions"`. */
  type: string;
  /** The resource's attributes. */
  attributes: TAttributes;
  /** Related resources, when included by the API. */
  relationships?: Record<string, unknown>;
}

/**
 * Attributes of a user resource.
 */
export interface UserAttributes {
  username: string;
  email: string;
  phone: string;
}

/**
 * Attributes of a wallet resource.
 */
export interface WalletAttributes {
  /** The wallet's owner (a numeric user id from the fallback backend). */
  owner_id: number;
  /** The current balance as a 2-decimal string, e.g. `"50000.00"`. */
  balance: string;
  /** Wallet status, e.g. `"active"`. */
  status: string;
}

/**
 * Attributes of a ledger (topup) resource.
 */
export interface LedgerAttributes {
  /** Transaction type, e.g. `"deposit"`. */
  type: string;
  /** The amount as a 2-decimal string. */
  amount: string;
  /** The money flow direction, e.g. `"credit"` or `"debit"`. */
  direction: string;
  /** Balance after the ledger entry with exactly two decimals. */
  balance_after: string;
  /** ISO timestamp of when the entry was created. */
  created_at: string;
}

/**
 * Attributes of a transaction (transfer) resource.
 */
export interface TransactionAttributes {
  type: "deposit" | "transfer" | "withdraw";
  status: "completed" | "pending" | "failed";
  description: string;
  /** ISO timestamp of when the transaction was created. */
  created_at: string;
}

/**
 * A user resource.
 */
export type UserResource = Resource<UserAttributes>;

/**
 * A wallet resource.
 */
export type WalletResource = Resource<WalletAttributes>;

/**
 * A ledger resource.
 */
export type LedgerResource = Resource<LedgerAttributes>;

/**
 * A transaction resource.
 */
export type TransactionResource = Resource<TransactionAttributes>;

/**
 * The `data` value of a successful login response.
 */
export interface LoginResponse {
  /** The Sanctum bearer token to attach to subsequent requests. */
  token: string;
  /** The authenticated user, nested under a single `data` key. */
  user: DataEnvelope<UserResource>;
}