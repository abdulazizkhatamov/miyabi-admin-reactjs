import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { Product } from '@/features/products/schema/product.schema'
import type { PaginatedResponse } from '@/types/pagination.type'
import axiosInstance from '@/config/axios.config'
import { columns } from '@/features/products/components/columns'
import { DataTable } from '@/features/products/components/data-table'
import { useDebounce } from '@/core/hooks/use-debounce'

// query factory so we can pass page + size dynamically
const productsQuery = (
  page: number,
  pageSize: number,
  filters?: { name?: string; status?: string },
) =>
  queryOptions<PaginatedResponse<Product>>({
    queryKey: ['products', page, pageSize, filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/products', {
        params: { page, pageSize, ...filters },
      })
      return data
    },
  })

export const Route = createFileRoute('/(app)/products/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(productsQuery(1, 10)),
  component: RouteComponent,
})

function RouteComponent() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [rawFilters, setRawFilters] = useState<{
    name?: string
    status?: string
  }>({})

  // 👇 debounce filters before triggering query
  const debouncedFilters = useDebounce(rawFilters, 500)

  const { data, isFetching } = useQuery({
    ...productsQuery(
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
        data={data.data} // ✅ only backend data, no local filtering
        pageCount={data.meta.pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onColumnFiltersChange={(columnFilters) => {
          const name = columnFilters.find((f) => f.id === 'name')
            ?.value as string
          const status = columnFilters.find((f) => f.id === 'status')
            ?.value as string
          setRawFilters({ name, status }) // just update raw filters
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }}
        isFetching={isFetching}
      />
    </div>
  )
}
