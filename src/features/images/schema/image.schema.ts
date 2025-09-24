import z from 'zod'

export const imageSchema = z.object({
  id: z.string(),
  path: z.string(),
  type: z.enum(['category', 'product', 'banner']),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Image = z.infer<typeof imageSchema>
