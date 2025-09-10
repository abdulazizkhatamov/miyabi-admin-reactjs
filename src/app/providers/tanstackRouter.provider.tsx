// tanstackRouter.provider.tsx
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { LoaderIcon } from 'lucide-react'
import { routeTree } from '@/routeTree.gen'
import { getContext } from '@/app/providers/tanstackQuery.provider'
import { useAuth } from '@/features/auth/hooks/useAuth'

// Single context shared across router + providers
const context = getContext()

const router = createRouter({
  routeTree,
  context: {
    ...context,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function TanstackRouterProvider() {
  const auth = useAuth()

  // Show loader until auth is ready
  if (!auth.isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderIcon className="animate-spin h-5 w-5" />
      </div>
    )
  }
  return <RouterProvider router={router} context={{ ...context, auth }} />
}
