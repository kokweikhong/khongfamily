"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FinanceExpensesRecord } from "@/types/finance";
import Swal from "sweetalert2";
import {
  useFinanceExpensesRecord,
  useFinanceExpensesCategories,
  useCreateFinanceExpensesRecord,
  useUpdateFinanceExpensesRecord,
  useDeleteFinanceExpensesRecord,
} from "@/query/finance";

const FormErrorMessage = ({ message }: { message: string }) => (
  <p className="mt-2 text-sm text-red-600">{message}</p>
);

type FinanceExpensesRecordFormProps = {
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  formType: "create" | "update";
  recordID?: number;
};

const FinanceExpensesRecordForm: React.FC<FinanceExpensesRecordFormProps> = (
  props,
) => {
  const financeExpensesRecordQuery = useFinanceExpensesRecord(props.recordID!);
  const financeExpensesCategoriesQuery = useFinanceExpensesCategories();
  const createFinanceExpensesRecordMutation = useCreateFinanceExpensesRecord();
  const updateFinanceExpensesRecordMutation = useUpdateFinanceExpensesRecord();
  const deleteFinanceExpensesRecordMutation = useDeleteFinanceExpensesRecord();

  const form = useForm<FinanceExpensesRecord>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<FinanceExpensesRecord> = (data) => {
    console.log(data);
    props.setOpenForm(false);

    // if (props.formType === "create") {
    //   createFinanceExpensesRecordMutation.mutate(data);
    // } else if (props.formType === "update") {
    //   updateFinanceExpensesRecordMutation.mutate(data);
    // }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,

      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (props.formType === "create") {
            await createFinanceExpensesRecordMutation.mutateAsync(data);
          } else if (props.formType === "update") {
            await updateFinanceExpensesRecordMutation.mutateAsync(data);
          }
          Swal.fire({
            title: "Submitted!",
            text: "Your records has been submitted.",
            icon: "success",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong.",
            icon: "error",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Your records is safe :)",
          icon: "info",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });

    form.reset({ name: "" });
  };

  // React.useEffect(() => {
  //   if (createFinanceExpensesRecordMutation.isSuccess) {
  //     Swal.fire({
  //       title: "Success",
  //       text: "Finance Expenses Record created",
  //       icon: "success",
  //     });
  //   }
  //   if (createFinanceExpensesRecordMutation.isError) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Finance Expenses Record not created",
  //       icon: "error",
  //     });
  //   }
  //   if (updateFinanceExpensesRecordMutation.isSuccess) {
  //     Swal.fire({
  //       title: "Success",
  //       text: "Finance Expenses Record updated",
  //       icon: "success",
  //     });
  //   }
  //   if (updateFinanceExpensesRecordMutation.isError) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Finance Expenses Record not updated",
  //       icon: "error",
  //     });
  //   }
  //   if (deleteFinanceExpensesRecordMutation.isSuccess) {
  //     Swal.fire({
  //       title: "Success",
  //       text: "Finance Expenses Record deleted",
  //       icon: "success",
  //     });
  //   }
  //   if (deleteFinanceExpensesRecordMutation.isError) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Finance Expenses Record not deleted",
  //       icon: "error",
  //     });
  //   }
  // }, [
  //   createFinanceExpensesRecordMutation,
  //   updateFinanceExpensesRecordMutation,
  //   deleteFinanceExpensesRecordMutation,
  // ]);

  React.useEffect(() => {
    if (props.formType === "create") {
      form.reset({ name: "" });
    } else if (props.formType === "update" && financeExpensesRecordQuery.data) {
      form.reset(financeExpensesRecordQuery.data);
    }
  }, [props.formType, financeExpensesRecordQuery.data]);

  if (
    financeExpensesRecordQuery.isLoading ||
    financeExpensesCategoriesQuery.isLoading
  ) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={props.openForm} onOpenChange={props.setOpenForm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`${props.formType} profile`}</DialogTitle>
          <DialogDescription>
            {`Make changes to your profile here. Click save when you're done.`}
          </DialogDescription>
        </DialogHeader>

        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-2">
              <Controller
                control={form.control}
                name="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                rules={{ required: "Please select a valid date" }}
                render={({ field }) => (
                  <div className="relative md:col-span-full">
                    <label
                      htmlFor="date"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...field}
                      value={field.value.slice(0, 10)}
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="name"
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Name
                    </label>
                    <input
                      {...field}
                      id="name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {form.formState.errors.name && (
                      <FormErrorMessage message={"Invalid name"} />
                    )}
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="categoryID"
                rules={{ required: true, minLength: 1 }}
                render={({ field }) => (
                  <div className="relative">
                    <label
                      htmlFor="category"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      defaultValue={field.value?.toString()}
                    >
                      <option value="">Select a category...</option>
                      {financeExpensesCategoriesQuery.data?.map((category) => (
                        <option
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.categoryID && (
                      <FormErrorMessage message={"Invalid category"} />
                    )}
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="currency"
                rules={{ required: true, minLength: 1 }}
                defaultValue="MYR"
                render={({ field }) => (
                  <div className="relative">
                    <label
                      htmlFor="currency"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Currency
                    </label>
                    <select
                      id="currency"
                      defaultValue={"MYR"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select a currency...</option>
                      <option value="MYR">MYR</option>
                      <option value="SGD">SGD</option>
                    </select>
                    {form.formState.errors.currency && (
                      <FormErrorMessage message={"Invalid currency"} />
                    )}
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="amount"
                defaultValue={0}
                rules={{ required: true, min: 0.1 }}
                render={({ field }) => (
                  <div className="relative">
                    <label
                      htmlFor="amount"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Amount
                    </label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                    {form.formState.errors.amount && (
                      <FormErrorMessage message={"Invalid amount"} />
                    )}
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="remarks"
                defaultValue={""}
                render={({ field }) => (
                  <div className="relative md:col-span-full">
                    <label
                      htmlFor="remarks"
                      className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      Remarks
                    </label>
                    <input
                      id="remarks"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="isFixedExpenses"
                defaultValue={true}
                render={({ field }) => (
                  <div className="flex h-6 items-center">
                    <input
                      id="isFixedExpenses"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <label
                      htmlFor="isFixedExpenses"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Is Fixed Expenses?
                    </label>
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="isPaid"
                defaultValue={false}
                render={({ field }) => (
                  <div className="flex h-6 items-center">
                    <input
                      id="isPaid"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <label
                      htmlFor="isPaid"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Is Paid?
                    </label>
                  </div>
                )}
              />
            </div>
            <Button type="submit" className="float-right">
              Submit
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceExpensesRecordForm;
