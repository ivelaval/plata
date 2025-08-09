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
import { supabase } from "@/infrastructure/supabase/client";

export class SupabaseUserRepository implements UserRepository {
  async getUser(id: bigint): Promise<User | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error || !data) {
      console.error("Error fetching user:", error);
      return null;
    }

    return {
      id: BigInt(data.id),
      name: data.name,
      email: data.email,
      passwordHash: data.password_hash,
      createdAt: new Date(data.created_at),
    };
  }

  async getUserAccounts(userId: bigint): Promise<Account[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", Number(userId));

    if (error) {
      console.error("Error fetching accounts:", error);
      return [];
    }

    return data.map((account) => ({
      id: BigInt(account.id),
      userId: account.user_id ? BigInt(account.user_id) : null,
      name: account.name,
      type: account.type,
      balance: account.balance,
      createdAt: new Date(account.created_at),
    }));
  }

  async getUserTransactions(userId: bigint): Promise<Transaction[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*, accounts!inner(user_id)")
      .eq("accounts.user_id", Number(userId))
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }

    return data.map((transaction) => ({
      id: BigInt(transaction.id),
      accountId: transaction.account_id ? BigInt(transaction.account_id) : null,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date),
      createdAt: new Date(transaction.created_at),
    }));
  }

  async getUserAssets(userId: bigint): Promise<Asset[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }

    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("user_id", Number(userId));

    if (error) {
      console.error("Error fetching assets:", error);
      return [];
    }

    return data.map((asset) => ({
      id: BigInt(asset.id),
      userId: asset.user_id ? BigInt(asset.user_id) : null,
      name: asset.name,
      value: asset.value,
      type: asset.type,
      createdAt: new Date(asset.created_at),
    }));
  }

  async getUserLiabilities(userId: bigint): Promise<Liability[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }

    const { data, error } = await supabase
      .from("liabilities")
      .select("*")
      .eq("user_id", Number(userId));

    if (error) {
      console.error("Error fetching liabilities:", error);
      return [];
    }

    return data.map((liability) => ({
      id: BigInt(liability.id),
      userId: liability.user_id ? BigInt(liability.user_id) : null,
      name: liability.name,
      amount: liability.amount,
      type: liability.type,
      createdAt: new Date(liability.created_at),
    }));
  }

  async getUserBudgets(userId: bigint): Promise<Budget[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }

    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", Number(userId));

    if (error) {
      console.error("Error fetching budgets:", error);
      return [];
    }

    return data.map((budget) => ({
      id: BigInt(budget.id),
      userId: budget.user_id ? BigInt(budget.user_id) : null,
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      createdAt: new Date(budget.created_at),
    }));
  }

  async getUserCycles(userId: bigint): Promise<Cycle[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }

    const { data, error } = await supabase
      .from("cycles")
      .select("*")
      .eq("user_id", Number(userId));

    if (error) {
      console.error("Error fetching cycles:", error);
      return [];
    }

    return data.map((cycle) => ({
      id: BigInt(cycle.id),
      userId: cycle.user_id ? BigInt(cycle.user_id) : null,
      name: cycle.name,
      startDate: new Date(cycle.start_date),
      endDate: new Date(cycle.end_date),
      recurring: cycle.recurring,
      createdAt: new Date(cycle.created_at),
    }));
  }

  async getCashFlowData(userId: bigint): Promise<CashFlowData[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }

    // Get transactions for the last 7 months for cash flow calculation
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

    const { data, error } = await supabase
      .from("transactions")
      .select("*, accounts!inner(user_id)")
      .eq("accounts.user_id", Number(userId))
      .gte("date", sevenMonthsAgo.toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching cash flow data:", error);
      return [];
    }

    // Group transactions by month and calculate cash flow
    const monthlyData = new Map<string, { inflow: number; outflow: number }>();

    data.forEach((transaction) => {
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
  }
}