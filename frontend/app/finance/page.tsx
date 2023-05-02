"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IRecord } from "@/types/finance/record";
import { API_URL } from "@/types/api";
import FinanceBarChart from "@/components/FinanceBarChart";
import { PieChart, Pie, Tooltip, Sector, Cell, ResponsiveContainer } from 'recharts';

type FilterDate = {
  from: string;
  to: string;
}

const FinancePage = () => {
  const [data, setData] = useState<IRecord[]>([]);
  const [monthlyBarChartData, setMonthlyBarChartData] = useState<any[]>([]);
  const [categoryPieChartData, setCategoryPieChartData] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState<FilterDate>({
    // from : today - 3 month and day from 1st day of month and to : today + 1 day 
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().slice(0, 10),
    to: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10),
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

  async function handleGetData() {
    await getMonthlyBarChartData();
    await getRecords();
    await getCategoryPieChartData();
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
    <div>
      <h1>Finance Page</h1>
      <div>
        <Link href="/finance/record/create" className="btn btn-primary">Create</Link>
      </div>

      <div className="flex gap-6 items-center">
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

      <div className="w-full h-80">
        <FinanceBarChart data={monthlyBarChartData} />
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
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

      {/* data table */}
      <table className="w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Date</th>
            <th>Name</th>
            <th>Category</th>
            <th>Currency</th>
            <th>Amount</th>
            <th>IsFixed</th>
            <th>Remarks</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {data.map((record, index) => (
            <tr key={record.id}>
              <td>{index + 1}</td>
              <td>{record.date}</td>
              <td>{record.name}</td>
              <td>{record.category_name}</td>
              <td>{record.currency}</td>
              <td>{record.amount}</td>
              <td>{`${record.isFixedExpense}`}</td>
              <td>{record.remarks}</td>
              <td>
                <Link href={`/finance/record/update/${record.id}`}>Edit</Link>
              </td>
              <td>
                <Link href={`/finance/record/delete/${record.id}`}>Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

  )
};

export default FinancePage;
