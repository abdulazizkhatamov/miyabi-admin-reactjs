import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchAdmin, logout } from '../store/auth.slice'
import type { AppDispatch, RootState } from '@/app/store'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { admin, isAuthReady } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isAuthReady) {
      dispatch(fetchAdmin())
    }
  }, [dispatch, isAuthReady])

  return {
    admin,
    isAuthReady,
    fetchAdmin: () => dispatch(fetchAdmin()),
    logout: () => dispatch(logout()),
  }
}
