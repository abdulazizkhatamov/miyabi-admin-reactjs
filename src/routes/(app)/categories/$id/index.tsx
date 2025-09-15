// src/routes/(app)/categories/$id.tsx
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { Category } from '@/features/categories/data/schema'
import axiosInstance from '@/config/axios.config'
import { EditCategoryCard } from '@/features/categories/components/edit-category-card'

// --- Query factory for single category ---
const categoryQuery = (id: string) => ({
  queryKey: ['category', id],
  queryFn: async (): Promise<Category> => {
    const { data } = await axiosInstance.get(`/categories/${id}`)
    return data
  },
})

export const Route = createFileRoute('/(app)/categories/$id/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(categoryQuery(params.id)),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/(app)/categories/$id/' })

  const { data: category, isLoading, isError } = useQuery(categoryQuery(id))

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Failed to load category.</div>
  if (!category) return <div>Not found</div>

  return <EditCategoryCard category={category} />
}
