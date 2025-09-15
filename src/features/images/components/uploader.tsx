import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconEye, IconX } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateImage } from '../hooks/useImageMutation'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

const schema = z.object({
  image: z
    .instanceof(File, { message: 'Please upload a valid image' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg and .png formats are supported.',
    ),
})

type FormValues = z.infer<typeof schema>

export default function ImageUploaderForm({
  type,
  entity_id,
}: {
  type: 'category' | 'product'
  entity_id: string | number
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: undefined,
    },
  })

  const queryClient = useQueryClient()
  const mutation = useCreateImage()
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const file = form.watch('image')

  const onSubmit = (data: FormValues) => {
    const formData = new FormData()

    if (data.image instanceof File) {
      formData.append('image', data.image)
    }

    // ✅ send both type and entity_id
    formData.append('type', type)
    formData.append('entity_id', String(entity_id))

    mutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['category', entity_id] })
        form.reset()
        setPreviewUrl(null)
        setIsOpen(false) // close dialog after success
      },
    })
  }

  const handleRemove = () => {
    form.reset()
    setPreviewUrl(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Image</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Choose an image to upload. Only JPG/PNG under 5MB are allowed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {/* File Input */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        field.onChange(file ?? undefined)
                        if (file) {
                          setPreviewUrl(URL.createObjectURL(file))
                        } else {
                          setPreviewUrl(null)
                        }
                      }}
                      // 👇 clear value each time so same file can be reselected
                      onClick={(e) => {
                        const input = e.target as HTMLInputElement
                        input.value = ''
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview Card */}
            {previewUrl && (
              <Card className="relative group overflow-hidden">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    type="button"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <IconEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    type="button"
                    onClick={handleRemove}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </CardContent>
              </Card>
            )}

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending || !file}>
                {mutation.isPending ? 'Uploading...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
