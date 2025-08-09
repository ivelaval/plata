import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, Account, Transaction, Asset, Liability, Budget, Cycle, CashFlowData } from '../../domain/entities/User';

export interface FinancialSummary {
  user: User | null;
  accounts: Account[];
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];
  budgets: Budget[];
  cycles: Cycle[];
  cashFlowData: CashFlowData[];
  totalBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyChange: number;
}

export class GetUserFinancialData {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: bigint): Promise<FinancialSummary> {
    const user = await this.userRepository.getUser(userId);
    const accounts = await this.userRepository.getUserAccounts(userId);
    const transactions = await this.userRepository.getUserTransactions(userId);
    const assets = await this.userRepository.getUserAssets(userId);
    const liabilities = await this.userRepository.getUserLiabilities(userId);
    const budgets = await this.userRepository.getUserBudgets(userId);
    const cycles = await this.userRepository.getUserCycles(userId);
    const cashFlowData = await this.userRepository.getCashFlowData(userId);

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const netWorth = totalBalance + totalAssets - totalLiabilities;
    const monthlyChange = 4.7; // Mock percentage change

    return {
      user,
      accounts,
      transactions,
      assets,
      liabilities,
      budgets,
      cycles,
      cashFlowData,
      totalBalance,
      totalAssets,
      totalLiabilities,
      netWorth,
      monthlyChange,
    };
  }
}