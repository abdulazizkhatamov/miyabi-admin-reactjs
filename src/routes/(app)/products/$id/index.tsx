import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import type { Product } from '@/features/products/schema/product.schema'
import axiosInstance from '@/config/axios.config'
import ImagesCarousel from '@/features/images/components/images-carousel'
import ImageUploaderForm from '@/features/images/components/uploader'
import { EditProductCard } from '@/features/products/components/edit-product-card'

// --- Query factory for single category ---
const productQuery = (id: string) => ({
  queryKey: ['product', id],
  queryFn: async (): Promise<Product> => {
    const { data } = await axiosInstance.get(`/products/${id}`)
    return data
  },
})

export const Route = createFileRoute('/(app)/products/$id/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(productQuery(params.id)),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/(app)/products/$id/' })

  const { data: product, isLoading, isError } = useQuery(productQuery(id))

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Failed to load category.</div>
  if (!product) return <div>Not found</div>

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Left side */}
      <div className="w-full lg:w-2/3">
        <EditProductCard product={product} />
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Images</h2>
            <ImageUploaderForm type="product" entity_id={id} />
            {/* uploader stays at top-right */}
          </div>

          <ImagesCarousel images={product.images} entity_id={product.id} />
        </div>
      </div>
    </div>
  )
}
