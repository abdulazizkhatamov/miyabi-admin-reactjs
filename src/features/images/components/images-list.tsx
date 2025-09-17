// ImagesList.tsx
import { useState } from 'react'
import { IconEye, IconTrash } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteImage } from '../hooks/useImageMutation'
import type { Image } from '../schema/image.schema'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

export default function ImagesList({
  images,
  entity_id,
}: {
  images: Array<Image>
  entity_id: string
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteImage()

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setOpen(true)
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
      // TODO: call your delete mutation here
    }
    setOpen(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="relative group overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => window.open(image.path, '_blank')}
              >
                <IconEye className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(image.id)}
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <img
                src={image.path}
                alt={`Image ${image.id}`}
                className="w-full h-48 object-cover"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
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
