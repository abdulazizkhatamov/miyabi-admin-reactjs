// hooks/useUploadImage.ts
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axiosInstance from '@/config/axios.config'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'

export function useCreateImage() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axiosInstance.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    },
    onSuccess: () => {
      toast.success('Image uploaded successfully', { position: 'top-center' })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, { position: 'top-center' })
    },
  })
}

export function useDeleteImage() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await axiosInstance.delete(`/images/${id}`)
      return res.data
    },
    onSuccess: (_data) => {
      toast.success('Image deleted successfully', { position: 'top-center' })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, { position: 'top-center' })
    },
  })
}
