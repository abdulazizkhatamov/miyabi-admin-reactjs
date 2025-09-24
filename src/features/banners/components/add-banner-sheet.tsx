import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { IconPlus } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'

import { useCreateBanner } from '../hooks/useBannerMutation'
import { createBannerSchema } from '../schema/banner.schema'
import type { CreateBannerFormValues } from '../schema/banner.schema'
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

export function AddBannerSheet() {
  const queryClient = useQueryClient()
  const createBanner = useCreateBanner()

  const form = useForm<CreateBannerFormValues>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(values: CreateBannerFormValues) {
    createBanner.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['banners'] })
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
          <SheetTitle>Add New Banner</SheetTitle>
          <SheetDescription>
            Enter a banner name to keep your menu items neatly organized.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <Form {...form}>
            <form
              id="add-banner-form"
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
                      <Input placeholder="e.g. Primary Banner" {...field} />
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
            form="add-banner-form"
            disabled={createBanner.isPending}
          >
            {createBanner.isPending ? 'Saving...' : 'Submit'}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
