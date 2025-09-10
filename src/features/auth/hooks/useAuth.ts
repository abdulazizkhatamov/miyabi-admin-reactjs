import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchStaff, logout } from '../store/auth.slice'
import type { AppDispatch, RootState } from '@/app/store'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { staff, isAuthReady } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isAuthReady) {
      dispatch(fetchStaff())
    }
  }, [dispatch, isAuthReady])

  return {
    staff,
    isAuthReady,
    fetchStaff: () => dispatch(fetchStaff()),
    logout: () => dispatch(logout()),
  }
}
