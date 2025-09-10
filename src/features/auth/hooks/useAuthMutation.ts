import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { postAuthLogin } from '../api/auth.api'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'

export const useLogin = () => {
  return useMutation({
    mutationFn: postAuthLogin,
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
