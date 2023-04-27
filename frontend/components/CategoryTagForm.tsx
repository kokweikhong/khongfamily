"use client";

import { ICategory } from '@/types/finance/category';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import { ITag } from '@/types/finance/tag';
import { API_URL } from '@/types/api';

type Props = {
  formType: 'category' | 'tag'
  data: ICategory | ITag
  method: 'create' | 'update' | 'delete'
};

const CategoryForm: React.FC<Props> = (
  { formType, data, method }
) => {
  const router = useRouter();
  const { register, reset, handleSubmit, formState: { errors } } = useForm<ICategory | ITag>({
    defaultValues: data
  });

  const [requestURL, setRequestURL] = React.useState<string>('');

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
      router.refresh();
    }
  };


  const onSubmit = handleSubmit((formData) => {
    handleRequest(formData);
  });

  useEffect(() => {
    let baseURL = { create: '', update: '', delete: '' };
    switch (formType) {

      case 'category':
        baseURL = API_URL.finance.category
      case 'tag':
        baseURL = API_URL.finance.tag
    }
    switch (method) {
      case 'create':
        reset();
        setRequestURL(baseURL.create);
        break;
      case 'update':
        reset(data);
        setRequestURL(baseURL.update);
        break;
      case 'delete':
        reset(data);
        setRequestURL(baseURL.delete);
        break;
      default:
        break;
    }
  }, [data]);

  return (
    <form onSubmit={onSubmit} className='max-w-[450px] mx-auto p-4 mt-4'>
      <h2 className='mb-6 capitalize'>{`${formType.toUpperCase()} Form (${method})`}</h2>
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
            {`${method.toUpperCase()}`}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
