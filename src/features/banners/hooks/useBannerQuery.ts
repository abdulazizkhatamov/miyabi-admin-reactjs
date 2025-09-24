// features/categories/queries.ts
import { queryOptions } from '@tanstack/react-query'
import type { Banner } from '../schema/banner.schema'
import axiosInstance from '@/config/axios.config'

export const allCategoriesQuery = queryOptions<Array<Banner>>({
  queryKey: ['banners', 'all'],
  queryFn: async () => {
    const { data } = await axiosInstance.get('/banners', {
      params: { page: 1, pageSize: 1000 }, // or endpoint for "all"
    })
    return data.data // if backend wraps in { data, meta }
  },
})
