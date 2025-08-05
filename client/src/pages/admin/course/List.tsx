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
import { ArrowUpDown, Eye, PencilLine } from "lucide-react";

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
  getCourseListAPI,
  updateCourseStatusAPI,
} from "@/API/services/courseService";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectInput } from "@/layouts/components/Select";
import Paginations from "@/layouts/components/Paginations";
import { useNavigate } from "react-router-dom";
import reduceString from "@/helpers/reduceString";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCourse } from "@/reducer/course";

export type Course = {
  id: string;
  name: string;
  image: string;
  _id: string;
  description: string;
  category: {
    name: string;
  };
  duration: number;
  isActive: boolean;
};

export default function List() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<Course[]>([]);
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

  type Pagination = {
    limit: number;
    totalCourses: number;
    totalPages: number;
    currentPage: number;
    count: number;
  };

  const [pagination, setPagination] = React.useState<Pagination>({
    limit: 0,
    totalPages: 0,
    currentPage: 0,
    totalCourses: 0,
    count: 0,
  });

  React.useEffect(() => {
    setLoading(true);
    // console.log(sortBy, order);

    getCourseListAPI({ page, limit, search, sortBy, order })
      .then((res) => {
        dispatch(setCourse(res.data.data.courses));
        setData(res.data.data.courses);
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
    updateCourseStatusAPI({ id })
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

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "S.No",
      header: "S.No",
      cell: ({ row }) => <div>{row.index + 1}.</div>,
    },
    {
      accessorKey: "image",
      header: "Image",

      cell: ({ row }) => (
        <img
          src={row.original.image}
          className="w-[35px] h-[35px] rounded-full"
          alt={row.original.name}
        />
      ),
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
      accessorKey: "category",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = order === "asc" ? "desc" : "asc";
            setOrder(newOrder);
            setSortBy("category.name");
          }}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.original.category.name}</div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duretion",
      cell: ({ row }) => (
        <div className="lowercase">{row.original.duration} Months</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="lowercase">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div> {reduceString(row.original.description, 20)}</div>
              </TooltipTrigger>
              {row.original.description.length > 20 && (
                <TooltipContent>
                  <p>{row.original.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
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
        <div className="flex gap-1 justify-end ">
          <button
            onClick={() => {
              navigate(`/admin/courses/${row.original._id}`);
            }}
            className="rounded-full p-1 hover:bg-gray-200"
          >
            <Eye size={15} />
          </button>
          <button className="rounded-full p-1 hover:bg-gray-200">
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
      <Card className="w-full p-4 max-w-7xl">
        <div className="w-full">
          <CardHeader className="flex items-center py-4 justify-between">
            <Input
              placeholder="Filter..."
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
              <Button
                variant="outline"
                onClick={() => navigate("/admin/courses/add")}
              >
                Add Course
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
              totalCategories={pagination.totalCourses}
              onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
              onNext={() =>
                setPage((prev) => Math.min(prev + 1, pagination.totalPages))
              }
              onPageClick={(page) => setPage(page)}
            />
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
