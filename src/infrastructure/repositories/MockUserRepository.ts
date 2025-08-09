import { UserRepository } from "../../domain/repositories/UserRepository";
import {
  User,
  Account,
  Transaction,
  Asset,
  Liability,
  Budget,
  Cycle,
  CashFlowData,
} from "../../domain/entities/User";

export class MockUserRepository implements UserRepository {
  async getUser(_id: bigint): Promise<User | null> {
    console.log("_id: ", _id);
    return {
      id: BigInt(1),
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hashed_password",
      createdAt: new Date(),
    };
  }

  async getUserAccounts(_userId: bigint): Promise<Account[]> {
    return [
      {
        id: BigInt(1),
        userId: _userId,
        name: "Main Wallet",
        type: "wallet",
        balance: 20520.32,
        createdAt: new Date(),
      },
      {
        id: BigInt(2),
        userId: _userId,
        name: "Savings Account",
        type: "savings",
        balance: 15800.45,
        createdAt: new Date(),
      },
      {
        id: BigInt(3),
        userId: _userId,
        name: "Investment Portfolio",
        type: "investment",
        balance: 50120.78,
        createdAt: new Date(),
      },
    ];
  }

  async getUserTransactions(_userId: bigint): Promise<Transaction[]> {
    console.log("_userId: ", _userId);
    return [
      {
        id: BigInt(1),
        accountId: BigInt(1),
        amount: 25500,
        type: "expense",
        category: "Business",
        description: "Software License",
        date: new Date("2026-04-17"),
        createdAt: new Date(),
      },
      {
        id: BigInt(2),
        accountId: BigInt(1),
        amount: 32750,
        type: "expense",
        category: "Travel",
        description: "Flight Ticket",
        date: new Date("2026-04-16"),
        createdAt: new Date(),
      },
    ];
  }

  async getUserAssets(_userId: bigint): Promise<Asset[]> {
    console.log("_userId: ", _userId);
    return [
      {
        id: BigInt(1),
        userId: _userId,
        name: "Real Estate Property",
        value: 250000,
        type: "real_estate",
        createdAt: new Date(),
      },
      {
        id: BigInt(2),
        userId: _userId,
        name: "Vehicle",
        value: 35000,
        type: "vehicle",
        createdAt: new Date(),
      },
    ];
  }

  async getUserLiabilities(_userId: bigint): Promise<Liability[]> {
    return [
      {
        id: BigInt(1),
        userId: _userId,
        name: "Home Mortgage",
        amount: 180000,
        type: "mortgage",
        createdAt: new Date(),
      },
      {
        id: BigInt(2),
        userId: _userId,
        name: "Credit Card Debt",
        amount: 5500,
        type: "credit_card",
        createdAt: new Date(),
      },
    ];
  }

  async getUserBudgets(_userId: bigint): Promise<Budget[]> {
    return [
      {
        id: BigInt(1),
        userId: _userId,
        category: "Food & Dining",
        amount: 800,
        period: "monthly",
        createdAt: new Date(),
      },
      {
        id: BigInt(2),
        userId: _userId,
        category: "Transportation",
        amount: 400,
        period: "monthly",
        createdAt: new Date(),
      },
    ];
  }

  async getUserCycles(_userId: bigint): Promise<Cycle[]> {
    return [
      {
        id: BigInt(1),
        userId: _userId,
        name: "Monthly Budget Cycle",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
        recurring: true,
        createdAt: new Date(),
      },
    ];
  }

  async getCashFlowData(_userId: bigint): Promise<CashFlowData[]> {
    console.log("_userId: ", _userId);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    return months.map((month, index) => ({
      date: month,
      cashFlow: 20000 + index * 8000 + Math.random() * 10000,
      inflow: 35000 + Math.random() * 5000,
      outflow: 15000 + Math.random() * 3000,
    }));
  }
}
