'use client'

import * as React from 'react'
import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { LoaderIcon } from 'lucide-react'
import { DataTablePagination } from '../../../shared/components/data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>
  data: Array<TData>
  pageCount: number
  pagination: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange: (updater: any) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  isFetching?: boolean // 👈 new prop
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  onColumnFiltersChange,
  isFetching,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    manualPagination: true, // ✅ server-side pagination
    manualFiltering: true, // ✅ server-side filtering
    manualSorting: true, // (optional) if sorting is also backend-driven
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater)
      const next = functionalUpdate(updater, columnFilters)
      onColumnFiltersChange?.(next)
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    // ❌ remove getFilteredRowModel()
    // ❌ remove getFacetedRowModel()
    // ❌ remove getFacetedUniqueValues()
    // sorting is fine if you want to keep client-side UI sorting,
    // but usually you’d move that server-side too → keep only if needed
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />

      <div className="relative overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
            {isFetching && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm"
                >
                  <LoaderIcon className="animate-spin w-5 h-5 text-gray-700 dark:text-gray-200" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
