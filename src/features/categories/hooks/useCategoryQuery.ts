import { useQuery } from '@tanstack/react-query'
import type { Category } from '../schema/category.schema'
import axiosInstance from '@/config/axios.config'

export const useCategoriesQuery = () => {
  return useQuery<Array<Category>>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/categories')
      return data
    },
  })
}
