import { Dispatch, SetStateAction } from "react";

export interface ICategory {
  id: number;
  name: string;
  remarks: string;
  created_at: string;
}

export interface ICategoryFormProps {
  data: ICategory;
  action: 'create' | 'update' | 'delete';
  setShowForm: Dispatch<SetStateAction<boolean>>;
}
