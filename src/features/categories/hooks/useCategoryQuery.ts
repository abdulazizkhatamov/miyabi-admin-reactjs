// features/categories/queries.ts
import { queryOptions } from '@tanstack/react-query'
import type { Category } from '../schema/category.schema'
import axiosInstance from '@/config/axios.config'

export const allCategoriesQuery = queryOptions<Array<Category>>({
  queryKey: ['categories', 'all'],
  queryFn: async () => {
    const { data } = await axiosInstance.get('/categories', {
      params: { page: 1, pageSize: 1000 }, // or endpoint for "all"
    })
    return data.data // if backend wraps in { data, meta }
  },
})
