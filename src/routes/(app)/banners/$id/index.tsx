// src/routes/(app)/banners/$id.tsx
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { Banner } from '@/features/banners/schema/banner.schema'
import axiosInstance from '@/config/axios.config'
import ImageUploaderForm from '@/features/images/components/uploader'
import ImagesCarousel from '@/features/images/components/images-carousel'
import { EditBannerCard } from '@/features/banners/components/edit-banner-card'

// --- Query factory for single banner ---
const bannerQuery = (id: string) => ({
  queryKey: ['banner', id],
  queryFn: async (): Promise<Banner> => {
    const { data } = await axiosInstance.get(`/banners/${id}`)
    return data
  },
})

export const Route = createFileRoute('/(app)/banners/$id/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(bannerQuery(params.id)),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/(app)/banners/$id/' })

  const { data: banner, isLoading, isError } = useQuery(bannerQuery(id))

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Failed to load banner.</div>
  if (!banner) return <div>Not found</div>

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Left side */}
      <div className="w-full lg:w-2/3">
        <EditBannerCard banner={banner} />
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Images</h2>
            <ImageUploaderForm type="banner" entity_id={id} />
            {/* uploader stays at top-right */}
          </div>

          <ImagesCarousel images={banner.images} entity_id={banner.id} />
        </div>
      </div>
    </div>
  )
}
