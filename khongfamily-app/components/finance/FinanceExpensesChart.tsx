import React from "react";
import { FinanceExpensesSummary } from "@/types/finance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartCardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  className,
  children,
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#C71585",
  "#FFD700",
  "#FF4500",
  "#32CD32",
  "#9370DB",
  "#8A2BE2",
  "#FF1493",
  "#ADFF2F",
  "#8B4513",
  "#4682B4",
  "#4B0082",
  "#8B008B",
  "#7B68EE",
  "#2E8B57",
  "#9932CC",
  "#DC143C",
  "#20B2AA",
  "#4169E1",
  "#556B2F",
  "#8B0000",
  "#D2691E",
  "#696969",
  "#6A5ACD",
];

type CustomizedLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

type ExpensesCategoryChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

const ExpensesCategoryChart: React.FC<ExpensesCategoryChartProps> = ({
  data,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={"120"}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

type FinanceExpensesProps = {
  date: string;
  totalExpenses: number;
  totalFixedExpenses: number;
  totalNonFixedExpenses: number;
};

const MonthlyExpensesChart: React.FC<{ data: FinanceExpensesProps[] }> = ({
  data,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="totalExpenses"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const FixedExpensesChart: React.FC<{ data: FinanceExpensesProps[] }> = ({
  data,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar
          type="monotone"
          dataKey="totalFixedExpenses"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Bar
          type="monotone"
          dataKey="totalNonFixedExpenses"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const FinanceExpensesChart: React.FC<FinanceExpensesSummary> = ({
  financeExpenses,
  financeExpensesCategory,
}) => {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row md:flex-wrap">
      {financeExpenses && financeExpenses.length > 1 && (
        <ChartCard title="Expenses Record" className="basis-full">
          <div className="h-80 w-full text-xs md:h-96">
            <MonthlyExpensesChart data={financeExpenses} />
          </div>
        </ChartCard>
      )}
      <div className="basis-full md:grid md:grid-cols-2 md:space-x-2">
        <ChartCard title="Expenses Record">
          <div className="h-80 w-full text-xs md:h-96">
            <FixedExpensesChart data={financeExpenses} />
          </div>
        </ChartCard>
        <ChartCard title="Expenses Record">
          <div className="h-80 w-full text-xs md:h-96">
            <ExpensesCategoryChart data={financeExpensesCategory} />
          </div>
        </ChartCard>
      </div>
      {/* {financeExpensesSummary.data.expensesRecord.total.length > 1 && (
        <ChartCard title="Expenses Record" className="basis-full">
          <ExpensesRecordChart {...financeExpensesSummary.data.expensesRecord} />
        </ChartCard>
      )} 
      <ChartCard title="Fixed vs NonFixed Expenses" className="md:basis-1/2">
        <FixedExpensesRecordChart {...financeExpensesSummary.data.fixedExpensesRecord} />
      </ChartCard>
      <ChartCard title="Expenses Category" className="relative md:flex-1">
        <ExpensesCategoryRecordChart {...financeExpensesSummary.data.expensesCategory} />
      </ChartCard> */}
    </div>
  );
};

export default FinanceExpensesChart;
