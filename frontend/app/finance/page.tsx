"use client";

import React, { useEffect, useState } from "react";
import { IRecord } from "@/types/finance/record";
import { API_URL } from "@/types/api";

const FinancePage = () => {
  const [records, setRecords] = useState<IRecord[]>([]);
  useEffect(() => {
    fetch(API_URL.finance.record.get)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
      });
  }, []);



  return (
    <div>
      <h1>Finance Page</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Year</th>
            <th>Month</th>
            <th>Name</th>
            <th>Category</th>
            <th>Currency</th>
            <th>Amount</th>
            <th>Tags</th>
            <th>Remarks</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {records.map((record, index) => (
            <tr key={record.id}>
              <td>{index + 1}</td>
              <td className="text-center">{record.year}</td>
              <td>{record.month}</td>
              <td>{record.name}</td>
              <td>{record.category_name}</td>
              <td>{record.currency}</td>
              <td>{record.amount}</td>
              <td>{record.tags}</td>
              <td>{record.remarks}</td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
};

export default FinancePage;
