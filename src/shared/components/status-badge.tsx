import { IconCircle, IconCircleFilled } from '@tabler/icons-react'
import { Badge } from '@/shared/components/ui/badge'

type StatusValue = boolean

interface StatusBadgeProps {
  value: StatusValue
  className?: string
}

const statuses = [
  {
    value: true,
    label: 'Active',
    icon: IconCircleFilled,
  },
  {
    value: false,
    label: 'Inactive',
    icon: IconCircle,
  },
]

export function StatusBadge({ value, className }: StatusBadgeProps) {
  const status = statuses.find((s) => s.value === value)

  if (!status) return null

  const Icon = status.icon

  return (
    <Badge
      variant="outline"
      className={`px-1.5 text-muted-foreground ${className ?? ''}`}
    >
      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
      <span>{status.label}</span>
    </Badge>
  )
}
