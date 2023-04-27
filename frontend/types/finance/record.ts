export interface IRecord {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  currency: string;
  amount: number;
  year: number;
  month: number;
  tags?: string[];
  remarks: string;
  created_at: string;
}

export const defaultRecord: IRecord = {
  id: 0,
  name: '',
  category_id: 0,
  category_name: '',
  currency: '',
  amount: 0,
  year: 0,
  month: 0,
  tags: [],
  remarks: '',
  created_at: '',
};
