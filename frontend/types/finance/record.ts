export interface IRecord {
  id: number;
  name: string;
  category_id: number;
  currency: string;
  amount: number;
  year: number;
  month: number;
  tags?: string[];
  remarks: string;
  created_at: string;
}
