// hooks/useUploadImage.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axiosInstance from '@/config/axios.config'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'

export function useCreateImage() {
  const queryClient = useQueryClient()

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
      queryClient.invalidateQueries({ queryKey: ['images'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Image uploaded successfully', { position: 'top-center' })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, { position: 'top-center' })
    },
  })
}
