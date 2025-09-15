import z from 'zod'

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

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>
export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>
