import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'
import axiosInstance from '@/config/axios.config'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await axiosInstance.post('/auth/login', payload)
      return data
    },
    onSuccess: () => {
      window.location.href = '/'
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })
}
