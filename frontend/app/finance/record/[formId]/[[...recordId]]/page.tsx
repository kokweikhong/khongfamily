"use client";

import React, { useState, useEffect } from 'react';
import { IRecord } from '@/types/finance/record';
import { ICategory } from '@/types/finance/category';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/types/api';
import Link from 'next/link';

type PageProps = {
  params: {
    formId: string;
    recordId: string[];
  }
};

const RecordForm: React.FC<PageProps> = ({ params }) => {
  const { formId, recordId } = params;
  const [requestURL, setRequestURL] = useState<string>('');
  const [record, setRecord] = useState<IRecord>()
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: record
  })

  useEffect(() => {
    handleGetCategories()

    if (formId === 'update' || formId === 'delete') {
      handleGetRecord(parseInt(recordId[0]))
    }

    // set request url
    switch (formId) {
      case 'create':
        setRequestURL(API_URL.finance.record.create ?? '')
        break;
      case 'update':
        setRequestURL(API_URL.finance.record.update ?? '')
        break;
      case 'delete':
        setRequestURL(`${API_URL.finance.record.delete}/${recordId[0]}` ?? '')
        break;
    }
  }, [formId, recordId]);

  useEffect(() => {
    if (record) {
      record.date = record.date.split('T')[0]
      reset(record)
    }
  }, [record])


  async function handleFormSubmit(data: IRecord) {
    // confirmation before submit
    if (!confirm('Are you confirm to submit?')) return
    data.date = new Date(data.date).toISOString()

    await fetch(requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    switch (formId) {
      case 'create':
        reset()
        router.refresh()
        break;
      default:
        router.push('/finance/')
        break;
    }
  }

  async function handleGetRecord(id: number) {
    const response = await fetch(`${API_URL.finance.record.get}/${id}` ?? '')
    const data = await response.json()
    setRecord(data)
  }

  async function handleGetCategories() {
    const response = await fetch(API_URL.finance.category.get ?? '')
    const data = await response.json()
    setCategories(data)
  }

  if (formId !== 'create' && formId !== 'update' && formId !== 'delete') return <div>404</div>

  return (
    <div className='container mx-auto'>
      <div className='p-5'>
        <Link href='/finance'>Finance Page</Link>
      </div>
      <div className='max-w-[500px] mx-auto mt-10'>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='w-full flex flex-col gap-3'>

          <div className='flex flex-col gap-1'>
            <label>Date</label>
            <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} {...register("date", { required: true })} className='rounded-md border border-primary p-2' />
            {errors.date && <span className='text-red-500 italic'>This field is required</span>}
          </div>


          <div className='flex flex-col gap-1'>
            <label>Name</label>
            <input type="text" {...register("name", { required: true })} className='rounded-md border border-primary p-2' />
            {errors.name && <span className='text-red-500 italic'>This field is required</span>}
          </div>

          <div className='flex flex-col gap-1'>
            <label>Category</label>
            <select {...register("category_id", { valueAsNumber: true, required: true })} className='rounded-md border border-primary p-2'>
              <option value="">Please Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.category_id && <span className='text-red-500 italic'>This field is required</span>}
          </div>


          <div className='flex flex-col gap-1'>
            <label>Currency</label>
            <select {...register("currency", { required: true })} className='rounded-md border border-primary p-2'>
              <option value="MYR">MYR</option>
              <option value="SGD">SGD</option>
            </select>
            {errors.currency && <span className='text-red-500 italic'>This field is required</span>}
          </div>

          <div className='flex flex-col gap-1'>
            <label>Amount</label>
            <input type="number" step={0.01} {...register("amount", { valueAsNumber: true, required: true })} className='rounded-md border border-primary p-2' />
            {errors.amount && <span className='text-red-500 italic'>This field is required</span>}
          </div>


          <div className='flex flex-col gap-1'>
            <label className='flex gap-4 cursor-pointer text-lg'>
              <input type="checkbox" {...register("isFixedExpense")} className='rounded-md border border-primary p-2' />
              Is Fixed Expenses
            </label>
          </div>



          <div className='flex flex-col gap-1'>
            <label>Remarks</label>
            <input type="text" {...register("remarks")} className='rounded-md border border-primary p-2' />
          </div>



          <button
            type='submit'
            className='uppercase rounded-md bg-primary text-white py-2 px-4'
          >{formId}</button>

        </form>
      </div>
    </div>
  );
};

export default RecordForm;
