// src/hooks/useCategoryMutation.ts
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateCategoryFormValues,
  UpdateCategoryFormValues,
} from '../schema/category.schema'
import axiosInstance from '@/config/axios.config'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (data: CreateCategoryFormValues) => {
      const res = await axiosInstance.post('/categories', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Category added successfully', {
        position: 'top-center',
      })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })
}

export function useUpdateCategory() {
  return useMutation({
    // `data` should include FormData and the category id
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateCategoryFormValues
    }) => {
      const res = await axiosInstance.patch(`/categories/${id}`, data)
      return res.data
    },
    onSuccess: (_data) => {
      toast.success('Category updated successfully', { position: 'top-center' })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })
}
