import { createFileRoute } from '@tanstack/react-router'
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { PaginatedResponse } from '@/types/pagination.type'
import type { Banner } from '@/features/banners/schema/banner.schema'
import axiosInstance from '@/config/axios.config'
import { useDebounce } from '@/core/hooks/use-debounce'
import { DataTable } from '@/features/banners/components/data-table'
import { columns } from '@/features/banners/components/columns'

// query factory
const bannersQuery = (
  page: number,
  pageSize: number,
  filters?: { name?: string },
) =>
  queryOptions<PaginatedResponse<Banner>>({
    queryKey: ['banners', page, pageSize, filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/banners', {
        params: { page, pageSize, ...filters },
      })
      return data
    },
  })

export const Route = createFileRoute('/(app)/banners/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(bannersQuery(1, 10)),
  component: RouteComponent,
})

function RouteComponent() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [rawFilters, setRawFilters] = useState<{
    name?: string
  }>({})

  // use reusable debounce hook
  const debouncedFilters = useDebounce(rawFilters, 500)

  const { data, isFetching } = useQuery({
    ...bannersQuery(
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
          setRawFilters({ name })
          // don’t reset pagination immediately — wait for new query
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }}
        isFetching={isFetching}
      />
    </div>
  )
}
