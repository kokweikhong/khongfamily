import { ICategory, ICategoryFormProps } from '@/types/finance/category';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'

const CategoryForm: React.FC<ICategoryFormProps> = (
  { data, action, setShowForm }
) => {
  const router = useRouter();
  const { register, reset, handleSubmit, formState: { errors } } = useForm<ICategory>({
    defaultValues: data
  });

  const [requestURL, setRequestURL] = React.useState<string>('');

  const handleRequest = async (formData: ICategory) => {
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
      setShowForm(false);
      router.refresh();
    }
  };


  const onSubmit = handleSubmit((formData) => {
    handleRequest(formData);
  });
  // firstName and lastName will have correct type
  //
  useEffect(() => {
    switch (action) {
      case 'create':
        reset();
        setRequestURL(`${process.env.NEXT_PUBLIC_API_URL}/finance/category/create/`);
        break;
      case 'update':
        reset(data);
        setRequestURL(`${process.env.NEXT_PUBLIC_API_URL}/finance/category/update/`);
        break;
      case 'delete':
        reset(data);
        setRequestURL(`${process.env.NEXT_PUBLIC_API_URL}/finance/category/delete/`);
        break;
      default:
        break;
    }
  }, [data]);

  return (
    <form onSubmit={onSubmit} className='max-w-[450px] mx-auto p-4 mt-4'>
      <h2 className='mb-6 capitalize'>{`Category Form (${action})`}</h2>
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
            {`${action}`}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className='bg-red-500 font-medium uppercase rounded-md px-4 py-2'
          >
            close
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
