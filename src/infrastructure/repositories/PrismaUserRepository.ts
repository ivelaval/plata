import { PrismaClient } from "@prisma/client";
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

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getUser(id: bigint): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  }

  async getUserAccounts(userId: bigint): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
    });

    return accounts.map((account) => ({
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type,
      balance: Number(account.balance),
      createdAt: account.createdAt,
    }));
  }

  async getUserTransactions(userId: bigint): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        account: {
          userId,
        },
      },
      include: {
        account: true,
      },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      accountId: transaction.accountId,
      amount: Number(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
      createdAt: transaction.createdAt,
    }));
  }

  async getUserAssets(userId: bigint): Promise<Asset[]> {
    const assets = await this.prisma.asset.findMany({
      where: { userId },
    });

    return assets.map((asset) => ({
      id: asset.id,
      userId: asset.userId,
      name: asset.name,
      value: Number(asset.value),
      type: asset.type,
      createdAt: asset.createdAt,
    }));
  }

  async getUserLiabilities(userId: bigint): Promise<Liability[]> {
    const liabilities = await this.prisma.liability.findMany({
      where: { userId },
    });

    return liabilities.map((liability) => ({
      id: liability.id,
      userId: liability.userId,
      name: liability.name,
      amount: Number(liability.amount),
      type: liability.type,
      createdAt: liability.createdAt,
    }));
  }

  async getUserBudgets(userId: bigint): Promise<Budget[]> {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
    });

    return budgets.map((budget) => ({
      id: budget.id,
      userId: budget.userId,
      category: budget.category,
      amount: Number(budget.amount),
      period: budget.period,
      createdAt: budget.createdAt,
    }));
  }

  async getUserCycles(userId: bigint): Promise<Cycle[]> {
    const cycles = await this.prisma.cycle.findMany({
      where: { userId },
    });

    return cycles.map((cycle) => ({
      id: cycle.id,
      userId: cycle.userId,
      name: cycle.name,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      recurring: cycle.recurring,
      createdAt: cycle.createdAt,
    }));
  }

  async getCashFlowData(_userId: bigint): Promise<CashFlowData[]> {
    // For now, generate mock data based on transactions
    // In a real implementation, this would aggregate transaction data by period
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
