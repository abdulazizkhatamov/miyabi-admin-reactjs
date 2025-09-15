import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUpdateCategory } from '../hooks/useCategoryMutation'
import { updateCategorySchema } from '../schema/category.schema'
import type { UpdateCategoryFormValues } from '../schema/category.schema'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Textarea } from '@/shared/components/ui/textarea'

interface EditCategoryCardProps {
  category: Category
}

export function EditCategoryCard({ category }: EditCategoryCardProps) {
  const updateCategory = useUpdateCategory()

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description ?? '',
      status: category.status, // boolean
    },
  })

  function onSubmit(values: UpdateCategoryFormValues) {
    updateCategory.mutate({ id: category.id, data: values })
  }

  return (
    <Card className="w-full max-w-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">
          Edit Menu Category
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Update the category name, description, and status to keep your menu
          organized.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            id="edit-category-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Beverages"
                      {...field}
                      className="text-sm md:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Drinks and cold refreshments"
                      {...field}
                      className="resize-y min-h-[100px] text-sm md:text-base"
                    />
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
                  <FormLabel className="text-sm md:text-base">Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(val === 'true')}
                      value={field.value ? 'true' : 'false'}
                    >
                      <SelectTrigger className="w-full text-sm md:text-base">
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
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-end pt-4">
        <Button
          type="submit"
          form="edit-category-form"
          disabled={updateCategory.isPending}
          className="px-6"
        >
          {updateCategory.isPending ? 'Updating...' : 'Update'}
        </Button>
      </CardFooter>
    </Card>
  )
}
