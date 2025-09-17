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
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Left side */}
      <div className="w-full lg:w-2/3">
        <EditCategoryCard category={category} />
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Images</h2>
            <ImageUploaderForm type="category" entity_id={id} />
            {/* uploader stays at top-right */}
          </div>

          <ImagesList images={category.images} entity_id={category.id} />
        </div>
      </div>
    </div>
  )
}
