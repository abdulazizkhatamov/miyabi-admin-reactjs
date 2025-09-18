// edit-product-card.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useUpdateProduct } from '../hooks/useProductMutation'
import { updateProductSchema } from '../schema/product.schema'
import type { Product, UpdateProductFormValues } from '../schema/product.schema'

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

import { allCategoriesQuery } from '@/features/categories/hooks/useCategoryQuery'

interface EditProductCardProps {
  product: Product
}

export function EditProductCard({ product }: EditProductCardProps) {
  const queryClient = useQueryClient()
  const updateProduct = useUpdateProduct()
  const { data: categories } = useQuery(allCategoriesQuery)

  // Initialize form
  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description,
      weight: product.weight,
      price: product.price,
      category_id: product.category_id,
      status: product.status,
    },
  })

  // Track dirty fields reliably
  const { dirtyFields } = useFormState({ control: form.control })

  // Submit handler
  function onSubmit(values: UpdateProductFormValues) {
    // Only include fields that are dirty (excluding id)
    const dirty: Partial<Omit<UpdateProductFormValues, 'id'>> = {}

    Object.keys(dirtyFields).forEach((key) => {
      if (key !== 'id') {
        // @ts-expect-error safe because keys come from UpdateProductFormValues
        dirty[key] = values[key]
      }
    })

    updateProduct.mutate(
      {
        id: product.id,
        data: {
          id: product.id,
          ...dirty,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['product', product.id] })
          queryClient.invalidateQueries({ queryKey: ['products'] })
          // Reset form to latest values so dirty tracking works for next edits
          form.reset(values)
        },
      },
    )
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Edit Product</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Update the product details to keep your menu organized.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form id="edit-product-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cheeseburger" {...field} />
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
                        placeholder="e.g. A juicy cheeseburger with fresh veggies"
                        {...field}
                        className="resize-y min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Weight */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (g)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 250"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g. 5.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {categories?.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => field.onChange(val === 'true')}
                        value={field.value ? 'true' : 'false'}
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

              {/* Submit */}
              <Button
                type="submit"
                form="edit-product-form"
                disabled={updateProduct.isPending}
                className="px-6 w-full"
              >
                {updateProduct.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
