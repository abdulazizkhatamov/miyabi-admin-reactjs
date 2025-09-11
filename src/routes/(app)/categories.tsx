import { createFileRoute } from '@tanstack/react-router'
import { useCategoriesQuery } from '@/features/categories/hooks/useCategoryQuery'
import { DataTable } from '@/features/categories/components/data-table'
import { columns } from '@/features/categories/components/columns'

export const Route = createFileRoute('/(app)/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useCategoriesQuery()
  return <DataTable data={data || []} columns={columns} />
}
