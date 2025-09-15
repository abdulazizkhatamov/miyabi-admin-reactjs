import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { IconPlus } from '@tabler/icons-react'
import { useCreateCategory } from '../hooks/useCategoryMutation'
import { createCategorySchema } from '../schema/category.schema'
import type { CreateCategoryFormValues } from '../schema/category.schema'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'

// const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
// const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export function AddCategorySheet() {
  const createCategory = useCreateCategory()

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  function onSubmit(values: CreateCategoryFormValues) {
    createCategory.mutate(values, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="ml-auto hidden h-8 lg:flex">
          <IconPlus />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Menu Category</SheetTitle>
          <SheetDescription>
            Add a category name, description and image to keep your menu
            organized.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <Form {...form}>
            <form
              id="add-category-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Name */}
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

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short description about this category..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <SheetFooter>
          <Button
            type="submit"
            form="add-category-form"
            disabled={createCategory.isPending}
          >
            {createCategory.isPending ? 'Saving...' : 'Submit'}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
