import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { IconTrash } from '@tabler/icons-react'
import { useDeleteBanner } from '../hooks/useBannerMutation'
import type { Banner } from '../schema/banner.schema'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'

interface DeleteBannerDialogProps {
  banner: Banner
}

export function DeleteBannerDialog({ banner }: DeleteBannerDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const deleteBanner = useDeleteBanner()

  function handleDelete() {
    deleteBanner.mutate(
      { id: banner.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['banners'] })
          queryClient.invalidateQueries({ queryKey: ['banner', banner.id] })
          setOpen(false) // ✅ close after success
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Banner</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this banner? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteBanner.isPending}
          >
            {deleteBanner.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
