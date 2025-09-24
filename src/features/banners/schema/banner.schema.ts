import z from 'zod'
import { imageSchema } from '@/features/images/schema/image.schema'

export const bannerSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(imageSchema),
  created_at: z.string(),
  updated_at: z.string(),
})

export const createBannerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export const updateBannerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export type Banner = z.infer<typeof bannerSchema>
export type CreateBannerFormValues = z.infer<typeof createBannerSchema>
export type UpdateBannerFormValues = z.infer<typeof updateBannerSchema>
