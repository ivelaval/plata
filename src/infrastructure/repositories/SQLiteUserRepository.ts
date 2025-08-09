import { UserRepository } from "@/domain/repositories/UserRepository";
import {
  User,
  Account,
  Transaction,
  Asset,
  Liability,
  Budget,
  Cycle,
  CashFlowData,
} from "@/domain/entities/User";
import { getSQLiteClient } from "@/infrastructure/sqlite/client";

export class SQLiteUserRepository implements UserRepository {
  private get db() {
    return getSQLiteClient();
  }

  async getUser(id: bigint): Promise<User | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
      const user = stmt.get(Number(id)) as { 
        id: number; 
        name: string; 
        email: string; 
        password_hash: string; 
        created_at: string; 
      } | undefined;

      if (!user) {
        return null;
      }

      return {
        id: BigInt(user.id),
        name: user.name,
        email: user.email,
        passwordHash: user.password_hash,
        createdAt: new Date(user.created_at),
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async getUserAccounts(userId: bigint): Promise<Account[]> {
    try {
      const stmt = this.db.prepare('SELECT * FROM accounts WHERE user_id = ?');
      const accounts = stmt.all(Number(userId)) as { id: number; user_id: number; name: string; type: string; balance: number; created_at: string }[];

      return accounts.map((account) => ({
        id: BigInt(account.id),
        userId: account.user_id ? BigInt(account.user_id) : null,
        name: account.name,
        type: account.type,
        balance: account.balance,
        createdAt: new Date(account.created_at),
      }));
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return [];
    }
  }

  async getUserTransactions(userId: bigint): Promise<Transaction[]> {
    try {
      const stmt = this.db.prepare(`
        SELECT t.* FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.user_id = ?
        ORDER BY t.date DESC
      `);
      const transactions = stmt.all(Number(userId)) as { id: number; account_id: number; amount: number; type: string; category: string; description: string; date: string; created_at: string }[];

      return transactions.map((transaction) => ({
        id: BigInt(transaction.id),
        accountId: transaction.account_id ? BigInt(transaction.account_id) : null,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        date: new Date(transaction.date),
        createdAt: new Date(transaction.created_at),
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  async getUserAssets(userId: bigint): Promise<Asset[]> {
    try {
      const stmt = this.db.prepare('SELECT * FROM assets WHERE user_id = ?');
      const assets = stmt.all(Number(userId)) as { id: number; user_id: number; name: string; value: number; type: string; created_at: string }[];

      return assets.map((asset) => ({
        id: BigInt(asset.id),
        userId: asset.user_id ? BigInt(asset.user_id) : null,
        name: asset.name,
        value: asset.value,
        type: asset.type,
        createdAt: new Date(asset.created_at),
      }));
    } catch (error) {
      console.error("Error fetching assets:", error);
      return [];
    }
  }

  async getUserLiabilities(userId: bigint): Promise<Liability[]> {
    try {
      const stmt = this.db.prepare('SELECT * FROM liabilities WHERE user_id = ?');
      const liabilities = stmt.all(Number(userId)) as { id: number; user_id: number; name: string; amount: number; type: string; created_at: string }[];

      return liabilities.map((liability) => ({
        id: BigInt(liability.id),
        userId: liability.user_id ? BigInt(liability.user_id) : null,
        name: liability.name,
        amount: liability.amount,
        type: liability.type,
        createdAt: new Date(liability.created_at),
      }));
    } catch (error) {
      console.error("Error fetching liabilities:", error);
      return [];
    }
  }

  async getUserBudgets(userId: bigint): Promise<Budget[]> {
    try {
      const stmt = this.db.prepare('SELECT * FROM budgets WHERE user_id = ?');
      const budgets = stmt.all(Number(userId)) as { id: number; user_id: number; category: string; amount: number; period: string; created_at: string }[];

      return budgets.map((budget) => ({
        id: BigInt(budget.id),
        userId: budget.user_id ? BigInt(budget.user_id) : null,
        category: budget.category,
        amount: budget.amount,
        period: budget.period,
        createdAt: new Date(budget.created_at),
      }));
    } catch (error) {
      console.error("Error fetching budgets:", error);
      return [];
    }
  }

  async getUserCycles(userId: bigint): Promise<Cycle[]> {
    try {
      const stmt = this.db.prepare('SELECT * FROM cycles WHERE user_id = ?');
      const cycles = stmt.all(Number(userId)) as { id: number; user_id: number; name: string; start_date: string; end_date: string; recurring: number; created_at: string }[];

      return cycles.map((cycle) => ({
        id: BigInt(cycle.id),
        userId: cycle.user_id ? BigInt(cycle.user_id) : null,
        name: cycle.name,
        startDate: new Date(cycle.start_date),
        endDate: new Date(cycle.end_date),
        recurring: Boolean(cycle.recurring),
        createdAt: new Date(cycle.created_at),
      }));
    } catch (error) {
      console.error("Error fetching cycles:", error);
      return [];
    }
  }

  async getCashFlowData(userId: bigint): Promise<CashFlowData[]> {
    try {
      // Get transactions for the last 7 months for cash flow calculation
      const sevenMonthsAgo = new Date();
      sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

      const stmt = this.db.prepare(`
        SELECT t.* FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.user_id = ? AND t.date >= ?
        ORDER BY t.date ASC
      `);
      const transactions = stmt.all(Number(userId), sevenMonthsAgo.toISOString().split("T")[0]) as { id: number; account_id: number; amount: number; type: string; category: string; description: string; date: string; created_at: string }[];

      // Group transactions by month and calculate cash flow
      const monthlyData = new Map<string, { inflow: number; outflow: number }>();

      transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthKey = date.toLocaleString("default", { month: "short" });

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { inflow: 0, outflow: 0 });
        }

        const monthData = monthlyData.get(monthKey)!;

        if (transaction.type === "income") {
          monthData.inflow += transaction.amount;
        } else {
          monthData.outflow += transaction.amount;
        }
      });

      // Convert to CashFlowData format
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
      return months.map((month) => {
        const data = monthlyData.get(month) || { inflow: 0, outflow: 0 };
        return {
          date: month,
          inflow: data.inflow,
          outflow: data.outflow,
          cashFlow: data.inflow - data.outflow,
        };
      });
    } catch (error) {
      console.error("Error fetching cash flow data:", error);
      return [];
    }
  }
}