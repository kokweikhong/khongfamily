"use client";

import React from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";

import FinanceExpensesRecordForm from "./FinanceExpensesForm";
import { FinanceExpensesRecord } from "@/types/finance";
import { useDeleteFinanceExpensesRecord } from "@/query/finance";
import Swal from "sweetalert2";
import Link from "next/link";

const columnHelper = createColumnHelper<FinanceExpensesRecord>();

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);
  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const NavigationButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function NavigationButton({ className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0",
        className,
      )}
      {...props}
    />
  );
});

NavigationButton.displayName = "NavigationButton";

interface FinanceExpensesTableProps {
  records: FinanceExpensesRecord[];
}

const FinanceExpensesTable: React.FC<FinanceExpensesTableProps> = ({
  records,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string | undefined>();
  // const rerender = React.useReducer(() => ({}), {})[1] as () => void;
  const [openForm, setOpenForm] = React.useState(false);
  const [recordID, setRecordID] = React.useState<number>(0);
  const [formType, setFormType] = React.useState<"create" | "update">("create");
  const deleteFinanceExpensesRecord = useDeleteFinanceExpensesRecord();

  function handleDeleteRecord(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, delete record #${id}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFinanceExpensesRecord.mutate(id);
        if (deleteFinanceExpensesRecord.isSuccess) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } else if (deleteFinanceExpensesRecord.isError) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  }

  const columns = [
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <div className="isolate inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => {
              setFormType("update");
              setRecordID(info.row.original.id);
              setOpenForm(true);
            }}
            className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <span className="sr-only">Edit</span>
            <Edit className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              handleDeleteRecord(info.row.original.id);
            }}
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <span className="sr-only">Next</span>
            <Trash className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => info.getValue().split("T")[0] ?? info.getValue(),
      sortingFn: (a, b) => {
        const aDate = new Date(a.getValue("date"));
        const bDate = new Date(b.getValue("date"));
        return aDate.getTime() - bDate.getTime();
      },
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("currency", {
      header: "Currency",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          <svg
            className="h-1.5 w-1.5 fill-yellow-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("remarks", {
      header: "Remarks",
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data: records,
    columns,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    debugTable: true,
  });

  return (
    <React.Fragment>
      <FinanceExpensesRecordForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        recordID={formType === "update" ? recordID : (undefined as any)}
        formType={formType}
      />

      <Card className="mb-4 bg-white">
        <CardHeader>
          <CardTitle>Expenses Record</CardTitle>
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex min-w-[280px] flex-col gap-2">
              <div>
                <DebouncedInput
                  value={globalFilter ?? ""}
                  onChange={(value) => setGlobalFilter(String(value))}
                  className="font-lg border-block max-w-sm border p-2 shadow"
                  placeholder="Search all columns..."
                />
              </div>
              <div>
                <Select
                  onValueChange={(value) => {
                    table.getColumn("category")?.setFilterValue(value);
                  }}
                  defaultValue={
                    table.getColumn("category")?.getFilterValue() as string
                  }
                >
                  <SelectTrigger className="font-lg border-block max-w-sm border p-2 shadow">
                    <SelectValue placeholder="Select a category to filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      table
                        .getColumn("category")
                        ?.getFacetedUniqueValues()
                        .keys() ?? [],
                    )
                      .sort()
                      .map((value: string) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  setFormType("create");
                  setOpenForm(true);
                }}
              >
                Add New
              </Button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Link href={"/finance/expenses-form/multiple-insert"}>
                  Mutilple Insert
                </Link>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-[500px] overflow-y-auto">
          <Table className="border-separate border-spacing-0">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn("sticky top-0 z-20 bg-white")}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex gap-3 whitespace-nowrap items-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        <span>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </span>
                        {{
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row
                    .getVisibleCells()
                    .map(
                      (cell) => (
                        console.log(cell.column.id),
                        (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        )
                      ),
                    )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="mt-2 flex w-full flex-wrap justify-between gap-1">
          <div className="flex space-x-2">
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <div>
              <select
                name="location"
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className="flex items-center gap-1">
              Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="block w-16 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </span>
            <div
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <NavigationButton
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
              </NavigationButton>
              <NavigationButton
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </NavigationButton>
              <NavigationButton
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </NavigationButton>
              <NavigationButton
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="h-5 w-5" aria-hidden="true" />
              </NavigationButton>
            </div>
          </div>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
};

export default FinanceExpensesTable;
