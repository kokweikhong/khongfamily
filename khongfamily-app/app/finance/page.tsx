"use client";

import React from "react";
import {
  useFinanceExpensesSummary,
  useFinanceExpensesRecords,
} from "@/query/finance";
import FinanceExpensesTable from "@/components/finance/FinanceExpensesTable";
import FinanceExpensesChart from "@/components/finance/FinanceExpensesChart";
import { FinanceExpensesSummary } from "@/types/finance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSession } from "next-auth/react";

export default function Page() {
  // const { data: session } = useSession();
  const [period, setPeriod] = React.useState("1y");
  // console.log(session?.user?.accessToken);
  const financeExpensesRecords = useFinanceExpensesRecords(period);
  const financeExpensesSummary = useFinanceExpensesSummary(period);
  const periods = ["1m", "2m", "3m", "6m", "1y", "2y", "3y"];

  // React.useEffect(() => {
  //   if (!session?.user.accessToken) {
  //     return;
  //   }
  //   financeExpensesSummary.refetch();
  // }, [financeExpensesSummary, period, session?.user?.accessToken]);

  if (financeExpensesSummary.isLoading || financeExpensesRecords.isLoading) {
    return <div>Loading...</div>;
  }

  if (financeExpensesSummary.isError || financeExpensesRecords.isError) {
    return (
      <div>
        {`Error: ${
          financeExpensesSummary.error || financeExpensesRecords.error
        }`}
      </div>
    );
  }

  if (!financeExpensesRecords.data || !financeExpensesSummary.data) {
    return <div>Null</div>;
  }

  const stats: { name: string; stat: string }[] = [
    {
      name: "Total Expenses",
      stat: `$${financeExpensesSummary.data?.financeExpenses
        .reduce((acc, curr) => acc + curr.totalExpenses, 0)
        .toFixed(2)}`,
    },
    {
      name: "Fixed Expenses",
      // decimal 2 places
      stat: `$${financeExpensesSummary.data?.financeExpenses
        .reduce((acc, curr) => acc + curr.totalFixedExpenses, 0)
        .toFixed(2)}`,
    },
    {
      name: "NonFixed Expenses",
      stat: `$${financeExpensesSummary.data?.financeExpenses
        .reduce((acc, curr) => acc + curr.totalNonFixedExpenses, 0)
        .toFixed(2)}`,
    },
    {
      name: `${
        financeExpensesSummary.data.financeExpensesCategory.reduce(
          (prev, current) => (prev.value > current.value ? prev : current),
        ).name
      }`,
      stat: `$${
        financeExpensesSummary.data.financeExpensesCategory.reduce(
          (prev, current) => (prev.value > current.value ? prev : current),
        ).value
      }`,
    },
  ];

  return (
    <main className="container px-4">
      <h1>Finance</h1>
      <Card className="mb-4 bg-[rgb(243,244,246)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold leading-6 text-gray-900">
            Expenses Summary
          </CardTitle>
          <div className="flex flex-col gap-2 py-2">
            <span className="text-sm text-gray-500">
              {
                financeExpensesRecords?.data[
                  financeExpensesRecords?.data.length - 1
                ].date.split("T")[0]
              }
              {" - "}
              {financeExpensesRecords?.data[0].date.split("T")[0]}
            </span>
            <div>
              <Select
                onValueChange={(value) => setPeriod(value)}
                defaultValue={period}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Periods</SelectLabel>
                    {periods.map((period) => (
                      <SelectItem
                        key={period}
                        value={period}
                        onClick={() => setPeriod(period)}
                      >
                        {period}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <FinanceExpensesTable records={financeExpensesRecords?.data || []} />

      <div>
        <FinanceExpensesChart {...financeExpensesSummary.data} />
      </div>
    </main>
  );
}
