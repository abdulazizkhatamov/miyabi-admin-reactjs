import { createFileRoute } from '@tanstack/react-router'
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Category } from '@/features/categories/data/schema'
import type { PaginatedResponse } from '@/types/pagination.type'
import { DataTable } from '@/features/categories/components/data-table'
import { columns } from '@/features/categories/components/columns'
import axiosInstance from '@/config/axios.config'

// query factory so we can pass page + size dynamically
const categoriesQuery = (
  page: number,
  pageSize: number,
  filters?: { name?: string; status?: string },
) =>
  queryOptions<PaginatedResponse<Category>>({
    queryKey: ['categories', page, pageSize, filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/categories', {
        params: { page, pageSize, ...filters },
      })
      return data
    },
  })

export const Route = createFileRoute('/(app)/categories/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(categoriesQuery(1, 10)),
  component: RouteComponent,
})

function RouteComponent() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [filters, setFilters] = useState<{ name?: string; status?: string }>({})

  const { data, isFetching } = useQuery({
    ...categoriesQuery(pagination.pageIndex + 1, pagination.pageSize, filters),
    placeholderData: keepPreviousData,
  })

  if (!data) return null // safeguard for very first load

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={data.data} // rows from backend
        pageCount={data.meta.pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onColumnFiltersChange={(columnFilters) => {
          const name = columnFilters.find((f) => f.id === 'name')
            ?.value as string
          const status = columnFilters.find((f) => f.id === 'status')
            ?.value as string
          setFilters({ name, status })
          setPagination((prev) => ({ ...prev, pageIndex: 0 })) // reset to first page
        }}
        isFetching={isFetching}
      />
    </div>
  )
}
