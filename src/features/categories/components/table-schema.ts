import z from 'zod'

export const schema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.string(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})
