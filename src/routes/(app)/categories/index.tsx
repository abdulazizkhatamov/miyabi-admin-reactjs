import { createFileRoute } from '@tanstack/react-router'
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Category } from '@/features/categories/schema/category.schema'
import type { PaginatedResponse } from '@/types/pagination.type'
import { DataTable } from '@/features/categories/components/data-table'
import { columns } from '@/features/categories/components/columns'
import axiosInstance from '@/config/axios.config'
import { useDebounce } from '@/core/hooks/use-debounce'

// query factory
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
  const [rawFilters, setRawFilters] = useState<{
    name?: string
    status?: string
  }>({})

  // use reusable debounce hook
  const debouncedFilters = useDebounce(rawFilters, 500)

  const { data, isFetching } = useQuery({
    ...categoriesQuery(
      pagination.pageIndex + 1,
      pagination.pageSize,
      debouncedFilters,
    ),
    placeholderData: keepPreviousData,
  })

  if (!data) return null

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={data.data}
        pageCount={data.meta.pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onColumnFiltersChange={(columnFilters) => {
          const name = columnFilters.find((f) => f.id === 'name')
            ?.value as string
          const status = columnFilters.find((f) => f.id === 'status')
            ?.value as string
          setRawFilters({ name, status })
          // don’t reset pagination immediately — wait for new query
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }}
        isFetching={isFetching}
      />
    </div>
  )
}
