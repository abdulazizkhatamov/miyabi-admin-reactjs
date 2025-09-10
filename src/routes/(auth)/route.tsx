import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.staff) {
      throw redirect({ to: '/' })
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
