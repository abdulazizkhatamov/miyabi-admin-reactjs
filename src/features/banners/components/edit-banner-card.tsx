// edit-banner-card.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { updateBannerSchema } from '../schema/banner.schema'
import { useUpdateBanner } from '../hooks/useBannerMutation'
import type { Banner, UpdateBannerFormValues } from '../schema/banner.schema'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

interface EditBannerCardProps {
  banner: Banner
}

export function EditBannerCard({ banner }: EditBannerCardProps) {
  const queryClient = useQueryClient()
  const updateBanner = useUpdateBanner()

  const form = useForm<UpdateBannerFormValues>({
    resolver: zodResolver(updateBannerSchema),
    defaultValues: {
      name: banner.name,
    },
  })

  // Track dirty fields reliably
  const { dirtyFields } = useFormState({ control: form.control })

  function onSubmit(values: UpdateBannerFormValues) {
    // Only include fields that are dirty (excluding id)
    const dirty: Partial<Omit<UpdateBannerFormValues, 'id'>> = {}

    Object.keys(dirtyFields).forEach((key) => {
      if (key !== 'id') {
        // @ts-expect-error safe because keys come from UpdateProductFormValues
        dirty[key] = values[key]
      }
    })

    updateBanner.mutate(
      {
        id: banner.id,
        data: dirty, // only dirty fields
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['banners'] })
          queryClient.invalidateQueries({ queryKey: ['banner', banner.id] })
          form.reset(values) // update baseline for next edits
        },
      },
    )
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Edit Banner</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Update the banner name to keep your menu organized.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form id="edit-banner-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Primary Banner"
                        {...field}
                        className="text-sm md:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}

              {/* Status */}

              {/* Submit */}
              <Button
                type="submit"
                form="edit-banner-form"
                disabled={updateBanner.isPending}
                className="px-6 w-full"
              >
                {updateBanner.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
