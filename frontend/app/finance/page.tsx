"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IRecord } from "@/types/finance/record";
import { API_URL } from "@/types/api";
import {
  PieChart, Pie, Tooltip, Sector, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

type FilterDate = {
  from: string;
  to: string;
}

const FinancePage = () => {
  const [data, setData] = useState<IRecord[]>([]);
  const [monthlyBarChartData, setMonthlyBarChartData] = useState<any[]>([]);
  const [categoryPieChartData, setCategoryPieChartData] = useState<any[]>([]);
  const [fixedExpenseBarChartData, setFixedExpenseBarChartData] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState<FilterDate>({
    // from : day=1st day of the month month=today month - 12 months
    from: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 2).toISOString().split('T')[0],
    // to : today + 1 day
    to: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toISOString().split('T')[0]
  });

  useEffect(() => {
    handleGetData();

  }, []);

  async function getRecords() {
    const res = await fetch(`${API_URL.finance.record.get}/?from=${filterDate.from}&to=${filterDate.to}` ?? "")
    const data = await res.json();
    setData(data);
  }


  async function getMonthlyBarChartData() {
    const res = await fetch(`${API_URL.finance.record.get}/?group=date&from=${filterDate.from}&to=${filterDate.to}` ?? "");
    const data = await res.json();
    setMonthlyBarChartData(data);
  }


  async function getCategoryPieChartData() {
    const res = await fetch(`${API_URL.finance.record.get}/?group=category&from=${filterDate.from}&to=${filterDate.to}` ?? "");
    const data = await res.json();
    setCategoryPieChartData(data);
  }


  async function getFixedExpenseBarChartData() {
    const res = await fetch(`${API_URL.finance.record.get}/?group=fixed&from=${filterDate.from}&to=${filterDate.to}` ?? "");
    const data = await res.json();
    setFixedExpenseBarChartData(data);
  }

  async function handleGetData() {
    await getMonthlyBarChartData();
    await getRecords();
    await getCategoryPieChartData();
    await getFixedExpenseBarChartData();
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };




  return (
    <div className="container mx-auto">
      <h1>Finance Page</h1>
      <div className="py-5 w-full">
        <Link href="/finance/record/create" className="btn btn-primary">Create</Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center py-5 w-full">
        <div className="flex flex-col">
          <label className="p-2">From Date :</label>
          <input className="p-2" type="date" value={filterDate.from} onChange={(e) => setFilterDate({ ...filterDate, from: e.target.value })} />
        </div>
        <div className="flex flex-col">
          <label className="p-2">To Date :</label>
          <input className="p-2" type="date" value={filterDate.to} onChange={(e) => setFilterDate({ ...filterDate, to: e.target.value })} />
        </div>
        <button onClick={handleGetData} className="px-4 py-2 uppercase bg-primary text-white">Get Data</button>
      </div>

      <hr />

      <div className="w-full h-[300px] mt-20">
        <h2 className="mb-4">Overall Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={150} height={40} data={monthlyBarChartData}>
            <YAxis />
            <XAxis dataKey="name" />
            <Legend />
            <Bar dataKey="total_amount" fill="#8884d8" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-[400px] mt-20">
        <h2 className="mb-4">Overall Expenses by Category</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={600} height={600}>
            <Pie
              data={categoryPieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              label={renderCustomizedLabel}
              fill="#8884d8"
              dataKey="total_amount"
            >
              {categoryPieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-[200px] mt-20">
        <h2 className="mb-4">Overall Fixed Expenses</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={fixedExpenseBarChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="fixed_expenses" fill="#8884d8" />
            <Bar dataKey="non_fixed_expenses" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* data table */}
      <div className="overflow-auto w-full mt-20">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Date</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Currency</th>
              <th className="p-4">Amount</th>
              <th className="p-4">IsFixed</th>
              <th className="p-4">Remarks</th>
              <th className="p-4">Edit</th>
              <th className="p-4">Delete</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {data.map((record, index) => (
              <tr key={record.id}>
                <td className="p-2 whitespace-nowrap">{index + 1}</td>
                <td className="p-2 whitespace-nowrap">{record.date.split('T')[0]}</td>
                <td className="p-2 whitespace-nowrap">{record.name}</td>
                <td className="p-2 whitespace-nowrap">{record.category_name}</td>
                <td className="p-2 whitespace-nowrap">{record.currency}</td>
                <td className="p-2 whitespace-nowrap">{record.amount}</td>
                <td className="p-2 whitespace-nowrap">{`${record.isFixedExpense}`}</td>
                <td className="p-2 whitespace-nowrap">{record.remarks}</td>
                <td className="p-2 whitespace-nowrap">
                  <Link href={`/finance/record/update/${record.id}`}>Edit</Link>
                </td>
                <td className="p-2 whitespace-nowrap">
                  <Link href={`/finance/record/delete/${record.id}`}>Delete</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>

  )
};

export default FinancePage;
