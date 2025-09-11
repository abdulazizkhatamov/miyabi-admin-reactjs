'use client'

import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { IconPlus } from '@tabler/icons-react'
import { useCreateCategory } from '../hooks/useCategoryMutation'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { DrawerForm } from '@/shared/components/drawer-form'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  image: z
    .instanceof(File, { message: 'Please upload a valid image' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg and .png formats are supported.',
    ),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function AddCategoryDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const createCategory = useCreateCategory()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      image: undefined,
    },
  })

  function onSubmit(values: CategoryFormValues) {
    const formData = new FormData()
    formData.append('name', values.name)
    if (values.image instanceof File) {
      formData.append('image', values.image)
    }

    createCategory.mutate(formData, {
      onSuccess: () => {
        form.reset() // clear form
        setIsOpen(false) // ✅ close drawer after success
      },
    })
  }

  return (
    <DrawerForm
      title="New Menu Category"
      description="Add a category name and image to keep your menu organized."
      trigger={
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <IconPlus />
        </Button>
      }
      onSubmit={form.handleSubmit(onSubmit)}
      open={isOpen}
      onOpenChange={setIsOpen} // allow drawer to open/close with trigger
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Beverages" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    field.onChange(file ?? undefined)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createCategory.isPending}
        >
          {createCategory.isPending ? 'Saving...' : 'Submit'}
        </Button>
      </Form>
    </DrawerForm>
  )
}
