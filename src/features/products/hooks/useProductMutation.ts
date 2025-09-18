import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type {
  CreateProductFormValues,
  UpdateProductFormValues,
} from '../schema/product.schema'
import axiosInstance from '@/config/axios.config'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data: CreateProductFormValues) => {
      const res = await axiosInstance.post('/products', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Product added successfully', {
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

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateProductFormValues
    }) => {
      const res = await axiosInstance.patch(`/products/${id}`, data)
      return res.data
    },
    onSuccess: (_data) => {
      toast.success('Product updated successfully', { position: 'top-center' })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })
}
