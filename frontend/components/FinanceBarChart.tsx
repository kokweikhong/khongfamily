"use client";

import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IRecord } from '@/types/finance/record';
import { ICategory } from '@/types/finance/category';
import { API_URL } from '@/types/api';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

type FinanceBarChartProps = {
  data: IRecord[];
}

interface IChartData {
  [key: string]: {
    [key: string]: number;
  }
}

const FinanceBarChart: React.FC<FinanceBarChartProps> = ({ data }) => {
  console.log(data)
  // const demoUrl = 'https://codesandbox.io/s/stacked-bar-chart-s47i2';
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [chartData, setChartData] = useState<IChartData[]>([]);

  useEffect(() => {
    fetch(API_URL.finance.category.get ?? '')
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setCategories(res)
      }
      )
  }, []);

  // useEffect(() => {
  // }, [data]);


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={150} height={40} data={data}>
        <Bar dataKey="total_amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default FinanceBarChart;
