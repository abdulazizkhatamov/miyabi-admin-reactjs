import { createFileRoute } from '@tanstack/react-router'
import { SectionCards } from '@/shared/components/section-cards'

export const Route = createFileRoute('/(app)/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SectionCards />
}
