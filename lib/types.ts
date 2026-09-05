export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface DataEnvelope<T> {
  data: T;
}

export interface Resource<TAttributes = Record<string, unknown>> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: Record<string, unknown>;
}

export interface UserAttributes {
  username: string;
  email: string;
  phone: string;
}

export interface WalletAttributes {
  owner_id: number;
  balance: string;
  status: string;
}

export interface LedgerAttributes {
  type: string;
  amount: string;
  direction: string;
  balance_after: string;
  created_at: string;
}

export interface TransactionAttributes {
  type: "deposit" | "transfer" | "withdraw";
  status: "completed" | "pending" | "failed";
  description: string;
  created_at: string;
}

export type UserResource = Resource<UserAttributes>;

export type WalletResource = Resource<WalletAttributes>;

export type LedgerResource = Resource<LedgerAttributes>;

export type TransactionResource = Resource<TransactionAttributes>;

export interface LoginResponse {
  token: string;
  user: DataEnvelope<UserResource>;
}