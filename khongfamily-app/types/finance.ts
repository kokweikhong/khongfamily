export interface FinanceExpensesRecord {
  id: number;
  date: string;
  name: string;
  category: string;
  categoryID: number;
  currency: string;
  amount: number;
  isFixedExpenses: boolean;
  isPaid: boolean;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceExpensesCategory {
  id: number;
  name: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export type FinanceExpensesSummary = {
  financeExpenses: {
    date: string;
    totalExpenses: number;
    totalFixedExpenses: number;
    totalNonFixedExpenses: number;
  }[];
  financeExpensesCategory: { name: string; value: number }[];
};
