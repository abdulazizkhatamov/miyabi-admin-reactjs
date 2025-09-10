import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/products"!</div>
}
