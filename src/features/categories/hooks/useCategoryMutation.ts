// src/hooks/useCategoryMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axiosInstance from '@/config/axios.config'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.post('/categories', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
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
  const queryClient = useQueryClient()

  return useMutation({
    // `data` should include FormData and the category id
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const res = await axiosInstance.patch(`/categories/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      // Refresh categories after update
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated successfully', {
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
