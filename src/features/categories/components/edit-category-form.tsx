import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { IconEdit } from '@tabler/icons-react'
import { useState } from 'react'
import { useUpdateCategory } from '../hooks/useCategoryMutation'
import type { Category } from '../data/schema'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface EditCategoryDrawerProps {
  category: Category
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

// Form schema
const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  status: z.string(),
  image: z
    .instanceof(File, { message: 'Please upload a valid image' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg and .png formats are supported.',
    )
    .optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function EditCategoryDrawer({ category }: EditCategoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateCategory = useUpdateCategory()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      status: category.status ? 'true' : 'false', // convert boolean to string
      image: undefined,
    },
  })

  function onSubmit(values: CategoryFormValues) {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('status', values.status)
    if (values.image instanceof File) formData.append('image', values.image)

    updateCategory.mutate(
      { id: category.id, data: formData },
      {
        onSuccess: () => {
          form.reset()
          setIsOpen(false) // ✅ close drawer after successful submit
        },
      },
    )
  }

  return (
    <DrawerForm
      title="Edit Menu Category"
      description="Edit a category name, image and status to keep your category organized."
      trigger={
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <IconEdit />
        </Button>
      }
      onSubmit={form.handleSubmit(onSubmit)}
      open={isOpen}
      onOpenChange={setIsOpen} // allow drawer to open/close with trigger
    >
      <Form {...form}>
        {/* Name field */}
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

        {/* Status field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => field.onChange(val)}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Statuses</SelectLabel>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image field */}
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

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={updateCategory.isPending}
        >
          {updateCategory.isPending ? 'Updating...' : 'Update'}
        </Button>
      </Form>
    </DrawerForm>
  )
}
