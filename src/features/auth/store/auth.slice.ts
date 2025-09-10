// features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '@/config/axios.config'

export interface Staff {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface AuthState {
  staff: Staff | null
  isAuthReady: boolean
}

const initialState: AuthState = {
  staff: null,
  isAuthReady: false,
}

// thunk to fetch current staff
export const fetchStaff = createAsyncThunk('auth/fetchStaff', async () => {
  const res = await axiosInstance.get('/staff-auth')
  return res.data.staff as Staff
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.staff = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.staff = action.payload
        state.isAuthReady = true
      })
      .addCase(fetchStaff.rejected, (state) => {
        state.staff = null
        state.isAuthReady = true
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
