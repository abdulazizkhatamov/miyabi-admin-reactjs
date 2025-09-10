import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import type { QueryClient } from '@tanstack/react-query'
import type { useAuth } from '@/features/auth/hooks/useAuth'
import { Toaster } from '@/shared/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
  auth: ReturnType<typeof useAuth>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
