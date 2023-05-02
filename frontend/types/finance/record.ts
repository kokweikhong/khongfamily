export interface IRecord {
  id: number;
  date: string;
  name: string;
  category_id: number;
  category_name: string;
  currency: string;
  amount: number;
  isFixedExpense: boolean;
  remarks: string;
  created_at: string;
}

export const defaultRecord: IRecord = {
  id: 0,
  date: '',
  name: '',
  category_id: 0,
  category_name: '',
  currency: '',
  amount: 0,
  isFixedExpense: false,
  remarks: '',
  created_at: '',
};
