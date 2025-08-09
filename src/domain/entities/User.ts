export interface User {
  id: bigint;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface Account {
  id: bigint;
  userId: bigint | null;
  name: string;
  type: string;
  balance: number;
  createdAt: Date;
}

export interface Transaction {
  id: bigint;
  accountId: bigint | null;
  amount: number;
  type: string;
  category: string;
  description: string | null;
  date: Date;
  createdAt: Date;
}

export interface Asset {
  id: bigint;
  userId: bigint | null;
  name: string;
  value: number;
  type: string;
  createdAt: Date;
}

export interface Liability {
  id: bigint;
  userId: bigint | null;
  name: string;
  amount: number;
  type: string;
  createdAt: Date;
}

export interface Budget {
  id: bigint;
  userId: bigint | null;
  category: string;
  amount: number;
  period: string;
  createdAt: Date;
}

export interface Cycle {
  id: bigint;
  userId: bigint | null;
  name: string;
  startDate: Date;
  endDate: Date;
  recurring: boolean;
  createdAt: Date;
}

export interface CashFlowData {
  date: string;
  cashFlow: number;
  inflow: number;
  outflow: number;
}