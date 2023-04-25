"use client";

import React from 'react';
import { IRecord } from '@/types/finance/record';
import { useForm } from 'react-hook-form';
import { months } from '@/types/months';

type Props = {
  record: IRecord;
  method: 'create' | 'update' | 'delete';
};

const RecordForm: React.FC<Props> = ({ record, method }) => {
  const [tag, setTag] = React.useState<string>('');
  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      ...record,
    },
  })

  function handleFormSubmit(data: IRecord) {
    console.log(data);
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

  // id: number;
  // name: string;
  // category_id: number;
  // currency: string;
  // amount: number;
  // year: number;
  // month: number;
  // tags?: string[];
  // remarks: string;
  // created_at: string;
  return (
    <div className='max-w-[500px] mx-auto'>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='w-full flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <label>Name</label>
          <input type="text" {...register("name")} className='rounded-md border border-primary p-2' />
        </div>

        <div className='flex flex-col gap-1'>
          <label>Category</label>
          <select {...register("category_id")} className='rounded-md border border-primary p-2'>
            {months.map((month) => (
              <option key={month.id} value={month.id}>{month.name}</option>
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
          <input type="number" {...register("amount")} className='rounded-md border border-primary p-2' />
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
          <select {...register("category_id", { valueAsNumber: true })} className='rounded-md border border-primary p-2'>
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
