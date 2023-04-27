"use client";

import React, { useState, useEffect } from 'react';
import { IRecord } from '@/types/finance/record';
import { ICategory } from '@/types/finance/category';
import { useForm } from 'react-hook-form';
import { months } from '@/types/months';
import { API_URL } from '@/types/api';

type Props = {
  record: IRecord;
  method: 'create' | 'update' | 'delete';
};

const RecordForm: React.FC<Props> = ({ record, method }) => {
  const [requestURL, setRequestURL] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [categories, setCategories] = useState<ICategory[]>([]);
  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

  useEffect(() => {
    fetch(API_URL.finance.category.get)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });

    // set request url
    switch (method) {
      case 'create':
        setRequestURL(API_URL.finance.record.create)
        break;
      case 'update':
        setRequestURL(API_URL.finance.record.update)
        break;
      case 'delete':
        setRequestURL(API_URL.finance.record.delete)
        break;
    }
  }, []);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      ...record,
    },
  })

  async function handleFormSubmit(data: IRecord) {
    console.log(data)
    data.created_at = new Date().toISOString()
    await fetch(requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  function handleAddTag() {
    if (record.tags?.includes(tag.toLowerCase())) return
    record.tags = [...record.tags ?? [], tag.toLowerCase() as string]
    reset(record)
    setTag('')
  }

  function handleRemoveTag(value: string) {
    record.tags = record.tags?.filter((tag) => tag !== value)
    reset(record)
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value)
    const findCategory = categories.find((category) => category.id === Number(e.target.value))
    console.log(findCategory)
    if (findCategory) {
      setValue('category_name', findCategory.name)
    }
  }

  return (
    <div className='max-w-[500px] mx-auto'>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='w-full flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <label>Name</label>
          <input type="text" {...register("name")} className='rounded-md border border-primary p-2' />
        </div>

        <div className='flex flex-col gap-1'>
          <label>Category</label>
          <select {...register("category_id", { valueAsNumber: true })} onChange={(e) => handleCategoryChange(e)} className='rounded-md border border-primary p-2'>
            <option value="">Please Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>


        <div className='flex flex-col gap-1'>
          <label>Currency</label>
          <select {...register("currency")} className='rounded-md border border-primary p-2'>
            <option value="MYR">MYR</option>
            <option value="SGD">SGD</option>
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label>Amount</label>
          <input type="number" step={0.01} {...register("amount", { valueAsNumber: true })} className='rounded-md border border-primary p-2' />
        </div>

        <div className='flex flex-col gap-1'>
          <label>Year</label>
          <select {...register("year", { valueAsNumber: true })} className='rounded-md border border-primary p-2'>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label>Month</label>
          <select {...register("month", { valueAsNumber: true })} className='rounded-md border border-primary p-2'>
            {months.map((month) => (
              <option key={month.id} value={month.id}>{month.name}</option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label>Remarks</label>
          <input type="text" {...register("remarks")} className='rounded-md border border-primary p-2' />
        </div>



        {/* tags input */}
        <div className='flex flex-col gap-2 bg-gray-300 py-4'>
          <ul className='flex flex-wrap gap-2 px-2'>
            {record.tags?.map((tag, index) => (
              <li key={index} className='bg-primary text-white text-[12px] flex gap-1 justify-around items-center p-2 rounded-sm'>
                <label>{tag}</label>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className='after:content-["X"] after:text-center flex items-center justify-center w-5 h-5 text-white p-2 font-medium rounded-full bg-gray-400'>
                </button>
              </li>
            ))}
          </ul>

          <div className='flex gap-2 items-center'>
            <label>Tags</label>
            <input
              type="text"
              value={tag}
              className='rounded-md border border-primary p-2'
              onChange={(e) => setTag(e.target.value)} />
            <button
              onClick={handleAddTag}
              className='uppercase rounded-md bg-primary text-white py-2 px-4'
            >set</button>
          </div>
        </div>


        <button
          type='submit'
          className='uppercase rounded-md bg-primary text-white py-2 px-4'
        >{method}</button>

      </form>
    </div>
  );
};

export default RecordForm;
