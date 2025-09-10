// features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '@/config/axios.config'

export interface Admin {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface AuthState {
  admin: Admin | null
  isAuthReady: boolean
}

const initialState: AuthState = {
  admin: null,
  isAuthReady: false,
}

// thunk to fetch current admin
export const fetchAdmin = createAsyncThunk('auth/fetchAdmin', async () => {
  const res = await axiosInstance.get('/auth/profile')
  return res.data.admin as Admin
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.admin = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = action.payload
        state.isAuthReady = true
      })
      .addCase(fetchAdmin.rejected, (state) => {
        state.admin = null
        state.isAuthReady = true
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
