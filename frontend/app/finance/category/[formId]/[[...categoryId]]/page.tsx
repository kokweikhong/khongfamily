"use client";

import { ICategory } from '@/types/finance/category';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { API_URL } from '@/types/api';

type PageProps = {
  params: {
    formId: string;
    categoryId: string[];
  }
};

const CategoryForm: React.FC<PageProps> = ({ params }) => {
  const { formId, categoryId } = params;
  if (formId !== 'create' && formId !== 'update' && formId !== 'delete') return <div>404</div>
  const [data, setData] = React.useState<ICategory>();
  const [requestURL, setRequestURL] = React.useState<string>('');
  const router = useRouter();
  const { register, reset, handleSubmit, formState: { errors } } = useForm<ICategory>({
    defaultValues: data
  });


  useEffect(() => {
    switch (formId) {
      case 'create':
        setRequestURL(API_URL.finance.category.create ?? '');
        break;
      case 'update':
        setRequestURL(API_URL.finance.category.update ?? '');
        break;
      case 'delete':
        setRequestURL(`${API_URL.finance.category.delete}/${categoryId[0]}` ?? '');
        break;
      default:
        break;
    }
    if (formId === 'update' || formId === 'delete') {
      handleGetCategory(parseInt(categoryId[0]));
    }
  }, []);

  useEffect(() => {
    reset(data);
  }, [data]);

  async function handleGetCategory(id: number) {
    const response = await fetch(`${API_URL.finance.category.get}${id}`);
    const data = await response.json();
    setData(data);
  }

  async function handleRequest(formData: ICategory) {
    try {
      formData.created_at = new Date().toISOString();
      const response = await fetch(requestURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      router.push('/finance/category');

    }
  };

  const onSubmit = handleSubmit((formData) => {
    handleRequest(formData);
  });

  return (
    <form onSubmit={onSubmit} className='max-w-[450px] mx-auto p-4 mt-4'>
      <h2 className='mb-6 capitalize'>{`Category Form (${formId.toUpperCase()})`}</h2>
      <div className='w-full flex flex-col gap-4 justify-center'>
        <div className='flex flex-col gap-1'>
          <label>Category Name</label>
          <input
            {...register("name", { required: true })}
            className='border border-primary rounded-md p-2'
          />
          {errors.name && <span className='small text-red-500 italic'>This field is required</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label>Remarks</label>
          <input
            {...register("remarks")}
            className='border border-primary rounded-md p-2'
          />
        </div>
        <div className='flex gap-4 justify-end items-center text-white'>
          <button
            type="submit"
            className='bg-blue-500 font-medium uppercase rounded-md px-4 py-2'
          >
            {`${formId.toUpperCase()}`}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
