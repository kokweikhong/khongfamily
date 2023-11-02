import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  FinanceExpensesRecord,
  FinanceExpensesSummary,
  FinanceExpensesCategory,
} from "../types/finance";
import { getSession } from "next-auth/react";

const apiURL = process.env.NEXT_PUBLIC_API_URL;
// const isServer = typeof window === "undefined";
// const apiURL = isServer
//   ? "http://khongfamily-broker:8080"
//   : "http://localhost:8080";

console.log(apiURL);

async function getAccessToken(): Promise<string> {
  const session = await getSession();
  if (!session?.user.accessToken) {
    throw new Error("No access token found");
  }
  return session.user.accessToken;
}

const financeExpensesAPI = axios.create({
  baseURL: `${apiURL}/finance/expenses`,
});

export async function getFinanceExpensesRecords(
  period: string,
): Promise<FinanceExpensesRecord[]> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesAPI.get("/records", {
    params: { period },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useFinanceExpensesRecords(period: string) {
  return useQuery(
    ["financeExpensesRecords", period],
    () => getFinanceExpensesRecords(period),
    { enabled: !!period },
  );
}

export async function getFinanceExpensesSummary(
  period: string,
): Promise<FinanceExpensesSummary> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesAPI.get("/summary", {
    params: { period },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useFinanceExpensesSummary(period: string) {
  return useQuery(
    ["financeExpensesSummary", period],
    () => getFinanceExpensesSummary(period),
    { enabled: !!period },
  );
}

export async function getFinanceExpensesRecord(
  id: number,
): Promise<FinanceExpensesRecord> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesAPI.get(`/records/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useFinanceExpensesRecord(id: number) {
  return useQuery(
    ["financeExpensesRecord", id],
    () => getFinanceExpensesRecord(id),
    { enabled: !!id },
  );
}

export async function createFinanceExpensesRecord(
  record: FinanceExpensesRecord,
): Promise<FinanceExpensesRecord> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesAPI.post("/records", record, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useCreateFinanceExpensesRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (record: FinanceExpensesRecord) =>
      createFinanceExpensesRecord(record),
    onSuccess: () => {
      queryClient.invalidateQueries(["financeExpensesRecords"]);
      queryClient.invalidateQueries(["financeExpensesSummary"]);
    },
  });
}

export async function createFinanceExpensesRecords(
  records: FinanceExpensesRecord[],
): Promise<FinanceExpensesRecord[]> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesAPI.post(
    "/records/insert-many",
    records,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return data;
}

export function useCreateFinanceExpensesRecords() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (records: FinanceExpensesRecord[]) =>
      createFinanceExpensesRecords(records),
    onSuccess: () => {
      queryClient.invalidateQueries(["financeExpensesRecords"]);
      queryClient.invalidateQueries(["financeExpensesSummary"]);
    },
  });
}

export async function updateFinanceExpensesRecord(
  record: FinanceExpensesRecord,
): Promise<FinanceExpensesRecord> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesAPI.put(
    `/records/${record.id}`,
    record,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return data;
}

export function useUpdateFinanceExpensesRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (record: FinanceExpensesRecord) =>
      updateFinanceExpensesRecord(record),
    onSuccess: (record: FinanceExpensesRecord) => {
      queryClient.invalidateQueries(["financeExpensesRecords"]);
      queryClient.invalidateQueries(["financeExpensesSummary"]);
      queryClient.invalidateQueries(["financeExpensesRecord", record.id]);
    },
  });
}

export async function deleteFinanceExpensesRecord(
  id: number,
): Promise<FinanceExpensesRecord> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesAPI.delete(`/records/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useDeleteFinanceExpensesRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFinanceExpensesRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["financeExpensesRecords"]);
      queryClient.invalidateQueries(["financeExpensesSummary"]);
    },
  });
}

const financeExpensesCategoriesAPI = axios.create({
  baseURL: `${apiURL}/finance/expenses/categories`,
});

export async function getFinanceExpensesCategories(): Promise<
  FinanceExpensesCategory[]
> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesCategoriesAPI.get("/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useFinanceExpensesCategories() {
  return useQuery(["financeExpensesCategories"], getFinanceExpensesCategories);
}

export async function getFinanceExpensesCategory(
  id: number,
): Promise<FinanceExpensesCategory> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesCategoriesAPI.get(`/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useFinanceExpensesCategory(id: number) {
  return useQuery(
    ["financeExpensesCategory", id],
    () => getFinanceExpensesCategory(id),
    { enabled: !!id },
  );
}

export async function createFinanceExpensesCategory(
  category: FinanceExpensesCategory,
): Promise<FinanceExpensesCategory> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesCategoriesAPI.post("/", category, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useCreateFinanceExpensesCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: FinanceExpensesCategory) =>
      createFinanceExpensesCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries(["financeExpensesCategories"]);
    },
  });
}

export async function updateFinanceExpensesCategory(
  category: FinanceExpensesCategory,
): Promise<FinanceExpensesCategory> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesCategoriesAPI.put(
    `/${category.id}`,
    category,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return data;
}

export function useUpdateFinanceExpensesCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: FinanceExpensesCategory) =>
      updateFinanceExpensesCategory(category),
    onSuccess: (category: FinanceExpensesCategory) => {
      queryClient.invalidateQueries(["financeExpensesCategories"]);
      queryClient.invalidateQueries(["financeExpensesCategory", category.id]);
    },
  });
}

export async function deleteFinanceExpensesCategory(
  id: number,
): Promise<FinanceExpensesCategory> {
  const accessToken = await getAccessToken();
  const { data } = await financeExpensesCategoriesAPI.delete(`/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export function useDeleteFinanceExpensesCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFinanceExpensesCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["financeExpensesCategories"]);
    },
  });
}
