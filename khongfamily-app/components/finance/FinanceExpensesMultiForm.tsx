"use client";

import React from "react";
import { Calendar, Plus, X } from "lucide-react";
import { FinanceExpensesRecord } from "@/types/finance";

import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
];

const categories: { id: number; name: string }[] = [
  { id: 0, name: "category 0" },
  { id: 1, name: "category 1" },
  { id: 2, name: "category 2" },
];

const FinanceExpensesMultiForm = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const [records, setRecords] = React.useState<FinanceExpensesRecord[]>([
    {
      id: 0,
      // date format in yyyy-mm-dd from new Date()
      date: currentDate,
      name: "",
      category: "",
      categoryID: 0,
      currency: "MYR",
      amount: 0,
      isFixedExpenses: true,
      isPaid: false,
      remarks: "",
      createdAt: "",
      updatedAt: "",
    },
  ]);

  const { register, handleSubmit, watch, control, setValue } = useForm<{
    data: FinanceExpensesRecord[];
  }>({
    defaultValues: {
      data: records,
    },
  });

  const updatedData = watch("data", records);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "data",
  });

  const onSubmit: SubmitHandler<{ data: FinanceExpensesRecord[] }> = async (
    data,
  ) => {
    console.log(data);
    // console.log(newData);
  };

  return (
    <div>
      <h1>Form</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mx-auto max-w-[250px] lg:col-start-3 lg:row-end-1">
            <h2 className="sr-only">Summary</h2>
            <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
              <dl className="flex flex-wrap">
                <div className="flex-auto pl-6 pt-6">
                  <dt className="text-sm font-semibold leading-6 text-gray-900">
                    Amount
                  </dt>
                  <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                    <span>
                      {`$${updatedData.reduce(
                        (acc, record) => acc + record.amount,
                        0 as number,
                      )}`}
                    </span>
                  </dd>
                </div>
                <div className="flex-none self-end px-6 pt-4">
                  <dt className="sr-only">Status</dt>
                  <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {`${updatedData.length || 0}`}
                  </dd>
                </div>

                <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <dt className="flex flex-nowrap items-center">
                    <span className="sr-only">Client</span>
                    <Calendar
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm font-medium leading-6 text-gray-900">
                    <input
                      type="date"
                      name="date"
                      id="date"
                      className="w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => {
                        fields.map((_, index) => {
                          setValue(`data.${index}.date`, e.target.value);
                        });
                      }}
                    />
                  </dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
                <button
                  type="submit"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Submit <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>

          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={() =>
                  append({
                    id: records.length,
                    date: currentDate,
                    name: "",
                    category: "",
                    categoryID: 0,
                    currency: "MYR",
                    amount: 0,
                    isFixedExpenses: true,
                    isPaid: false,
                    remarks: "",
                    createdAt: "",
                    updatedAt: "",
                  })
                }
                className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Plus
                  className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Add New Record
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {fields.map((item, index) => (
              <li
                key={item.id}
                className="relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
              >
                {/* remove form fields */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute -top-1 right-0 rounded-full bg-red-600 p-1 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
                {/* remove form fields end */}
                <div className="grid w-full grid-cols-1 items-center justify-center space-y-4 p-6">
                  {/* <Controller
                    control={control}
                    name={`data.${index}.date`}
                    defaultValue={date}
                    render={({ field }) => (
                      <input type="date" {...field} value={date} hidden />
                    )}
                  /> */}
                  {/* name input */}
                  <Controller
                    control={control}
                    name={`data.${index}.name`}
                    defaultValue=""
                    render={({ field }) => (
                      <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium text-gray-900"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Expenses Name"
                          {...field}
                        />
                      </div>
                    )}
                  />
                  {/* name input end */}

                  {/* amount input */}
                  <Controller
                    control={control}
                    name={`data.${index}.amount`}
                    defaultValue={0}
                    render={({ field }) => (
                      <div className="w-full">
                        <div className="relative mt-2 rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            step={0.01}
                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value));
                            }}
                          />

                          {/* currency input */}
                          <Controller
                            control={control}
                            name={`data.${index}.currency`}
                            defaultValue={"MYR"}
                            render={({ field }) => (
                              <div className="absolute inset-y-0 right-0 flex items-center">
                                <label htmlFor="currency" className="sr-only">
                                  Currency
                                </label>
                                <select
                                  id="currency"
                                  className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                  {...field}
                                >
                                  <option value={"MYR"}>MYR</option>
                                  <option value={"SGD"}>SGD</option>
                                </select>
                              </div>
                            )}
                          />
                          {/* currency input end */}
                        </div>
                      </div>
                    )}
                  />
                  {/* amount input end */}

                  {/* category id input */}
                  <Controller
                    control={control}
                    name={`data.${index}.categoryID`}
                    defaultValue={0}
                    render={({ field }) => (
                      <div>
                        <select
                          className="mt-0 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />
                  {/* category id input end */}

                  {/* remarks input */}
                  <Controller
                    control={control}
                    name={`data.${index}.remarks`}
                    defaultValue=""
                    render={({ field }) => (
                      <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label
                          htmlFor="remarks"
                          className="block text-xs font-medium text-gray-900"
                        >
                          Remarks
                        </label>
                        <input
                          type="text"
                          id="remarks"
                          className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Remarks..."
                          {...field}
                        />
                      </div>
                    )}
                  />
                  {/* remarks input end */}
                </div>

                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      {/* isPaid input */}
                      <Controller
                        control={control}
                        name={`data.${index}.isPaid`}
                        defaultValue={false}
                        render={({ field }) => (
                          <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                            <div className="flex h-6 items-center">
                              <input
                                id={`${index}.isPaid`}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                }}
                              />
                            </div>
                            <label
                              htmlFor={`${index}.isPaid`}
                              className="ml-3 text-sm font-medium leading-6 text-gray-900"
                            >
                              isPaid?
                            </label>
                          </div>
                        )}
                      />
                      {/* isPaid input end */}
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      {/* isFixedExpenses input */}
                      <Controller
                        control={control}
                        name={`data.${index}.isFixedExpenses`}
                        defaultValue={true}
                        render={({ field }) => (
                          <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                            <div className="flex h-6 items-center">
                              <input
                                id={`data.${index}.isFixedExpenses`}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                }}
                              />
                            </div>
                            <label
                              htmlFor={`data.${index}.isFixedExpenses`}
                              className="ml-3 text-sm font-medium leading-6 text-gray-900"
                            >
                              isFixedExpenses?
                            </label>
                          </div>
                        )}
                      />
                      {/* isFixedExpenses input end */}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default FinanceExpensesMultiForm;
