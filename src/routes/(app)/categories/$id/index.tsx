// src/routes/(app)/categories/$id.tsx
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { Category } from '@/features/categories/schema/category.schema'
import axiosInstance from '@/config/axios.config'
import { EditCategoryCard } from '@/features/categories/components/edit-category-card'
import ImageUploaderForm from '@/features/images/components/uploader'
import ImagesList from '@/features/images/components/images-list'
import { Separator } from '@/shared/components/ui/separator'

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

  return (
    <div className="flex flex-col gap-5">
      <EditCategoryCard category={category} />
      <Separator />
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Images</h2>
          <ImageUploaderForm type="category" entity_id={id} />
          {/* 👈 uploader button at top-right */}
        </div>
      </div>
      <ImagesList images={category.images} />
    </div>
  )
}
