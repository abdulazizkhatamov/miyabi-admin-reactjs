import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/shared/components/app-sidebar'
import { SiteHeader } from '@/shared/components/site-header'
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.staff) {
      throw redirect({ to: '/login' })
    }
  },
})

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
