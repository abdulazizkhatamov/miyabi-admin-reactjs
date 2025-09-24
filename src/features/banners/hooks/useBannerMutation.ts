import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateBannerFormValues,
  UpdateBannerFormValues,
} from '../schema/banner.schema'
import axiosInstance from '@/config/axios.config'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'

export function useCreateBanner() {
  return useMutation({
    mutationFn: async (data: CreateBannerFormValues) => {
      const res = await axiosInstance.post('/banners', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Banner added successfully', {
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

export function useUpdateBanner() {
  return useMutation({
    // `data` should include FormData and the banner id
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateBannerFormValues
    }) => {
      const res = await axiosInstance.patch(`/banners/${id}`, data)
      return res.data
    },
    onSuccess: (_data) => {
      toast.success('Banner updated successfully', { position: 'top-center' })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })
}

export function useDeleteBanner() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await axiosInstance.delete(`/banners/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Banner deleted succesfully', { position: 'top-center' })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })
}
