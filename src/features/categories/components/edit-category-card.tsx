import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUpdateCategory } from '../hooks/useCategoryMutation'
import { updateCategorySchema } from '../schema/category.schema'
import type {
  Category,
  UpdateCategoryFormValues,
} from '../schema/category.schema'

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
      status: category.status,
    },
  })

  function onSubmit(values: UpdateCategoryFormValues) {
    updateCategory.mutate({ id: category.id, data: values })
  }

  return (
    <Card className="w-full shadow-sm">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left side (Name + Description) */}
            <div className="space-y-6">
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
            </div>

            {/* Right side (Status + Submit Button) */}
            <div className="flex flex-col justify-between space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">
                      Status
                    </FormLabel>
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

              <div className="flex justify-end md:justify-start pt-2">
                <Button
                  type="submit"
                  form="edit-category-form"
                  disabled={updateCategory.isPending}
                  className="px-6 w-full"
                >
                  {updateCategory.isPending ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
