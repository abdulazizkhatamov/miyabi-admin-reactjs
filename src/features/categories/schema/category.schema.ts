import z from 'zod'
import { imageSchema } from '@/features/images/schema/image.schema'

export const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  images: z.array(imageSchema),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .optional()
    .or(z.literal('')),
})

export const updateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .optional()
    .or(z.literal('')),
  status: z.boolean(),
})

export type Category = z.infer<typeof categorySchema>
export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>
export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>
