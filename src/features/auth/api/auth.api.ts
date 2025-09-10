import axiosInstance from '@/config/axios.config'

export const postAuthLogin = async (payload: {
  email: string
  password: string
}) => {
  const { data } = await axiosInstance.post('/staff-auth/login', payload)
  return data
}
