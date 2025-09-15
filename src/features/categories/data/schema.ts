import z from 'zod'

export const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  image: z.string(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Category = z.infer<typeof categorySchema>
