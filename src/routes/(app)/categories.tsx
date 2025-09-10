import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/features/categories/components/table'

export const Route = createFileRoute('/(app)/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DataTable data={[]} />
}
