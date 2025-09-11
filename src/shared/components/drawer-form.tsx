import React from 'react'
import { useIsMobile } from '@/core/hooks/use-mobile'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import { Button } from '@/shared/components/ui/button'

interface DrawerFormProps {
  title: string
  description?: string
  trigger?: React.ReactNode
  children: React.ReactNode
  onSubmit?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DrawerForm({
  title,
  description,
  trigger,
  children,
  onSubmit,
  open,
  onOpenChange,
}: DrawerFormProps) {
  const isMobile = useIsMobile()

  return (
    <Drawer
      direction={isMobile ? 'bottom' : 'right'}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="ml-auto h-8">
            Open
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="min-h-4/5">
        <DrawerHeader className="gap-1">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit?.()
            }}
            className="flex flex-col gap-4"
          >
            {children}
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
