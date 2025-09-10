import { useSortable } from '@dnd-kit/sortable'
import { IconGripVertical } from '@tabler/icons-react'
import type { ComponentProps, ReactNode } from 'react'

type DragHandleProps = {
  id: string | number
  icon?: ReactNode
  srText?: string
  className?: string
} & Omit<ComponentProps<'button'>, 'id'>

export function DragHandle({
  id,
  icon = <IconGripVertical className="size-3 text-muted-foreground" />,
  srText = 'Drag to reorder',
  className,
  ...props
}: DragHandleProps) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <button
      {...attributes}
      {...listeners}
      {...props}
      className={`text-muted-foreground size-7 hover:bg-transparent ${className ?? ''}`}
    >
      {icon}
      <span className="sr-only">{srText}</span>
    </button>
  )
}
