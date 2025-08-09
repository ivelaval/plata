import { User, Account, Transaction, Asset, Liability, Budget, Cycle, CashFlowData } from '@/domain/entities/User';

export interface UserRepository {
  getUser(id: bigint): Promise<User | null>;
  getUserAccounts(userId: bigint): Promise<Account[]>;
  getUserTransactions(userId: bigint): Promise<Transaction[]>;
  getUserAssets(userId: bigint): Promise<Asset[]>;
  getUserLiabilities(userId: bigint): Promise<Liability[]>;
  getUserBudgets(userId: bigint): Promise<Budget[]>;
  getUserCycles(userId: bigint): Promise<Cycle[]>;
  getCashFlowData(userId: bigint): Promise<CashFlowData[]>;
}