import z from 'zod'
import { imageSchema } from '@/features/images/schema/image.schema'
import { categorySchema } from '@/features/categories/schema/category.schema'

// model Product {
//   id          String   @id @default(uuid())
//   slug        String   @unique
//   name        String
//   description String
//   weight      Int
//   price       Decimal  @db.Decimal(10, 2) // consistent, precise
//   status      Boolean  @default(true)
//   created_at  DateTime @default(now())
//   updated_at  DateTime @updatedAt

//   category    Category? @relation(fields: [category_id], references: [id])
//   category_id String?

//   order_items OrderItem[]
//   images      Image[]
// }

export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  weight: z.number(),
  price: z.string(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),

  images: z.array(imageSchema),
  category: categorySchema,
  category_id: z.string(),
})

export const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  weight: z.number().positive('Weight must be greater than 0'),
  price: z.string().regex(/^\d{1,8}(\.\d{1,2})?$/, {
    message: 'Price must have up to 10 digits in total and at most 2 decimals',
  }),
  category_id: z.string().min(1, 'Category ID is required'),
})

export const updateProductSchema = z.object({
  id: z.string(), // required to identify the product

  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .optional()
    .or(z.literal('')),
  weight: z.number().positive('Weight must be greater than 0').optional(),
  price: z
    .string()
    .regex(/^\d{1,8}(\.\d{1,2})?$/, {
      message:
        'Price must have up to 10 digits in total and at most 2 decimals',
    })
    .optional(),
  category_id: z.string().optional(),
  status: z.boolean().optional(),
})

export type Product = z.infer<typeof productSchema>
export type CreateProductFormValues = z.infer<typeof createProductSchema>
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>
