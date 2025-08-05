"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";

import {
  getCourseCategoryAPI,
  updateCourseCategoryStatusAPI,
} from "@/API/services/courseService";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectInput } from "@/layouts/components/Select";
import Paginations from "@/layouts/components/Paginations";
import { toast } from "sonner";
import CategoryForm from "@/layouts/admin/components/course/CategoryForm";

export type Category = {
  id: string;
  name: string;
  isActive: boolean;
  _id: string;
};

export default function Category() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [editData, setEditData] = React.useState<null | Pick<
    Category,
    "id" | "name"
  >>(null);

  type Pagination = {
    limit: number;
    totalCategories: number;
    totalPages: number;
    currentPage: number;
    count: number;
  };

  const [pagination, setPagination] = React.useState<Pagination>({
    limit: 0,
    totalPages: 0,
    currentPage: 0,
    totalCategories: 0,
    count: 0,
  });

  React.useEffect(() => {
    setLoading(true);
    // console.log(sortBy, order);

    getCourseCategoryAPI({ page, limit, search, sortBy, order })
      .then((res) => {
        console.log(data);
        setData(res.data.data.categories);
        setPagination(res.data.data.pagination);
        setLoading(false);
      })
      .catch((err) => {
        setData([]);
        setLoading(false);
        console.error(err);
      });
  }, [page, limit, search, sortBy, order, reload]);
  const changeSatus = (id: string) => {
    updateCourseCategoryStatusAPI({ id })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Status Changed");
          setReload(!reload);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Somthing went wrong");
        setReload(!reload);
      });
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "S.No",
      header: "S.No",
      cell: ({ row }) => <div>{row.index + 1}.</div>,
    },
    {
      accessorKey: "name",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = order === "asc" ? "desc" : "asc";
            setOrder(newOrder);
            setSortBy("name");
          }}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.original.name}</div>,
    },
    {
      accessorKey: "isActive",
      header: () => <div className="text-right mr-[10px]">Status</div>,
      cell: ({ row }) => (
        <div className="flex justify-end  text-sm ">
          <Button
            onClick={() => {
              changeSatus(row.original._id);
            }}
            variant={row.original.isActive ? "outline" : "default"}
            className={` h-[20px] w-[65px] text-sm font-semibold   `}
          >
            {row.original.isActive ? "active" : "inactive"}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <button
            onClick={() => {
              console.log(row.original);

              setIsOpen(true);
              setEditData({
                name: row.original.name,
                id: row.original._id,
              });
            }}
            className="rounded-full p-1 hover:bg-gray-200"
          >
            <PencilLine size={15} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize: limit,
        pageIndex: page - 1,
      },
    },
    manualPagination: true,
    manualSorting: true,
    pageCount: pagination.totalPages,
  });

  // console.log(table.getRowModel().rows[0]);
  return (
    <div className="w-full h-full flex justify-center items-start">
      <Card className="w-full  p-4 max-w-7xl">
        <div className="w-full">
          <CardHeader className="flex items-center py-4 justify-between">
            <Input
              placeholder="Filter name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-sm"
            />
            <div className="flex gap-1 h-full">
              <SelectInput
                width={"100px"}
                placeholder="Limit"
                title="Limit"
                value={limit}
                onChange={(val) => {
                  setLimit(val);
                  setPage(1);
                }}
                values={[
                  { name: "10", value: 10 },
                  { name: "20", value: 20 },
                  { name: "50", value: 50 },
                  { name: "100", value: 100 },
                ]}
              />
              <Button variant="outline" onClick={() => setIsOpen(true)}>
                Add Category
              </Button>
            </div>
          </CardHeader>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-[37px] w-full mb-2" />
                      ))}
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <CardFooter className="mt-3 flex justify-between items-center">
            <Paginations
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              limit={pagination.limit}
              count={pagination.count}
              totalCategories={pagination.totalCategories}
              onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
              onNext={() =>
                setPage((prev) => Math.min(prev + 1, pagination.totalPages))
              }
              onPageClick={(page) => setPage(page)}
            />
          </CardFooter>

          <CategoryForm
            data={editData}
            isOpen={isOpen}
            setIsOpen={() => {
              setIsOpen(false);
              setPage(1);
              setReload(!reload);
            }}
            setEditDta={() => setEditData(null)}
          />
        </div>
      </Card>
    </div>
  );
}
