"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Edit2, FilePlus2 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import { FinanceExpensesCategory } from "@/types/finance";
import {
  useFinanceExpensesCategories,
  useCreateFinanceExpensesCategory,
  useUpdateFinanceExpensesCategory,
  useDeleteFinanceExpensesCategory,
} from "@/query/finance";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { cn } from "@/lib/utils";

export default function Page() {
  const financeExpensesCategories = useFinanceExpensesCategories();
  const createFinanceExpensesCategory = useCreateFinanceExpensesCategory();
  const updateFinanceExpensesCategory = useUpdateFinanceExpensesCategory();
  const deleteFinanceExpensesCategory = useDeleteFinanceExpensesCategory();

  const [formType, setFormType] = React.useState<
    "create" | "update" | "delete"
  >("create");

  const [openForm, setOpenForm] = React.useState(false);

  const { register, handleSubmit, control, reset } =
    useForm<FinanceExpensesCategory>({
      defaultValues: {
        name: "",
        remarks: "",
      },
    }); // initialize the hook

  const handleSwalSuccessMessage = (): SweetAlertOptions => {
    let options: SweetAlertOptions = {
      icon: "success",
      title: "Success",
      text: `Category ${formType} successfully`,
    };
    return options;
  };

  const handleSwalErrorMessage = (error: any): SweetAlertOptions => {
    let options: SweetAlertOptions = {
      icon: "error",
      title: "Error",
      text: `Category ${formType} failed: ${error}`,
    };
    return options;
  };

  const handleSwalMessageOptions = (): SweetAlertOptions | undefined => {
    if (formType === "create") {
      if (createFinanceExpensesCategory.isSuccess) {
        return handleSwalSuccessMessage();
      } else if (createFinanceExpensesCategory.isError) {
        return handleSwalErrorMessage(createFinanceExpensesCategory.error);
      }
    }

    if (formType === "update") {
      if (updateFinanceExpensesCategory.isSuccess) {
        return handleSwalSuccessMessage();
      } else if (updateFinanceExpensesCategory.isError) {
        return handleSwalErrorMessage(updateFinanceExpensesCategory.error);
      }
    }

    if (formType === "delete") {
      if (deleteFinanceExpensesCategory.isSuccess) {
        return handleSwalSuccessMessage();
      } else if (deleteFinanceExpensesCategory.isError) {
        return handleSwalErrorMessage(deleteFinanceExpensesCategory.error);
      }
    }
    return undefined;
  };

  const handleSwalMessage = (options?: SweetAlertOptions) => {
    if (options) {
      Swal.fire(options);
    }
  };

  const onSubmit: SubmitHandler<FinanceExpensesCategory> = (data) => {
    console.log(data);
    if (formType === "create") {
      createFinanceExpensesCategory.mutate(data);
    }
    if (formType === "update") {
      updateFinanceExpensesCategory.mutate(data);
    }
    if (formType === "delete") {
      deleteFinanceExpensesCategory.mutate(data.id);
    }
    setOpenForm(false);
  };

  React.useEffect(() => {
    handleSwalMessage(handleSwalMessageOptions());
  }, [
    createFinanceExpensesCategory.isSuccess,
    updateFinanceExpensesCategory.isSuccess,
    deleteFinanceExpensesCategory.isSuccess,
    createFinanceExpensesCategory.isError,
    updateFinanceExpensesCategory.isError,
    deleteFinanceExpensesCategory.isError,
    handleSwalMessageOptions,
  ]);

  if (financeExpensesCategories.isLoading) {
    return <div>Loading...</div>;
  }

  if (!financeExpensesCategories.data) {
    return <div>No data found</div>;
  }


  return (
    <main className="container mx-auto px-4">
      <h1>Finance Expenses Category Dashboard</h1>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{`${formType} Category`}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex">
            <div className="mx-auto flex flex-col items-center justify-center gap-6">
              <Controller
                name="id"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <div className="mt-2">
                    <input
                      id="name"
                      placeholder="category name"
                      {...field}
                      hidden
                    />
                  </div>
                )}
              />

              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className="min-w-[250px]">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="category name"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />
              <Controller
                name="remarks"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className="min-w-[250px]">
                    <div className="flex justify-between">
                      <label
                        htmlFor="remarks"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Remarks
                      </label>
                      <span
                        className="text-sm leading-6 text-gray-500"
                        id="email-optional"
                      >
                        Optional
                      </span>
                    </div>
                    <div className="mt-2">
                      <input
                        id="remarks"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="remarks"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />
              <div className="ml-auto md:mt-auto">
                <button
                  type="submit"
                  className={cn(
                    "inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                    formType === "delete" &&
                      "bg-red-600 hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-red-200",
                    formType === "update" &&
                      "bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-yellow-200",
                  )}
                >
                  {formType === "update" ? (
                    <>
                      <Edit2 className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                      <span>Update</span>
                    </>
                  ) : formType === "delete" ? (
                    <>
                      <Trash2 className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                      <span>Delete</span>
                    </>
                  ) : (
                    <>
                      <FilePlus2
                        className="-ml-0.5 h-5 w-5"
                        aria-hidden="true"
                      />
                      <span>Create</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            setFormType("create");
            reset({ name: "", remarks: "" });
            setOpenForm(true);
          }}
        >
          <FilePlus2 className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          <span>Create</span>
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-sm font-medium text-gray-500">Category List</h2>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {financeExpensesCategories?.data?.map((category) => (
            <li
              key={category.id}
              className="col-span-1 flex rounded-md shadow-sm"
            >
              <div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <p className="font-medium text-gray-900 hover:text-gray-600">
                    {category.name}
                  </p>
                  <p className="text-gray-500">
                    {category.remarks === "" ? "No remarks" : category.remarks}
                  </p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setFormType("update");
                      reset(category);
                      setOpenForm(true);
                    }}
                  >
                    <span className="sr-only">Edit category</span>
                    <Edit2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setFormType("delete");
                      reset(category);
                      setOpenForm(true);
                    }}
                  >
                    <span className="sr-only">Delete category</span>
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
