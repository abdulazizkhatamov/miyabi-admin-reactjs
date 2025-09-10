import axiosInstance from '@/config/axios.config'

export const postAuthLogin = async (payload: {
  email: string
  password: string
}) => {
  const { data } = await axiosInstance.post('/auth/login', payload)
  return data
}
