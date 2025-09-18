import { useState } from 'react'
import {
  IconEye,
  IconRotate,
  IconTrash,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { useDeleteImage } from '../hooks/useImageMutation'
import type { Image } from '../schema/image.schema'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

import 'react-photo-view/dist/react-photo-view.css'
import '@/shared/styles/swiper.css'

export default function ImagesCarousel({
  images,
  entity_id,
}: {
  images: Array<Image>
  entity_id: string
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteImage()

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setOpenDelete(true)
  }

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(
        { id: deleteId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category', entity_id] })
          },
        },
      )
    }
    setOpenDelete(false)
    setDeleteId(null)
  }

  if (images.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
    )
  }

  return (
    <div className="space-y-4">
      <PhotoProvider
        maskOpacity={0.9}
        toolbarRender={({ rotate, onRotate, scale, onScale }) => (
          <div className="flex items-center gap-2">
            <IconRotate
              onClick={() => onRotate(rotate + 90)}
              aria-label="Rotate"
              className="cursor-pointer p-2 rounded-md"
              width={35}
              height={35}
            />
            <IconZoomIn
              onClick={() => onScale(scale + 1)}
              aria-label="Zoom In"
              className="cursor-pointer p-2 rounded-md"
              width={35}
              height={35}
            />
            <IconZoomOut
              onClick={() => onScale(scale - 1)}
              aria-label="Zoom Out"
              className="cursor-pointer p-2 rounded-md"
              width={35}
              height={35}
            />
          </div>
        )}
      >
        <Swiper
          navigation
          pagination={{ clickable: true, type: 'fraction' }}
          mousewheel={false}
          keyboard
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          className="w-full rounded-xl shadow-sm"
        >
          {images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative group overflow-hidden rounded-xl border bg-background shadow-sm">
                {/* Overlay Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <PhotoView src={image.path}>
                    <span className="inline-block">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-md shadow-sm"
                        aria-label="Preview"
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                    </span>
                  </PhotoView>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-md shadow-sm"
                    onClick={() => handleDelete(image.id)}
                    aria-label="Delete"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image */}
                <div className="w-full flex items-center justify-center bg-muted">
                  <img
                    src={image.path}
                    alt={`Image ${image.id}`}
                    className="max-h-[400px] w-auto object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </PhotoProvider>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
