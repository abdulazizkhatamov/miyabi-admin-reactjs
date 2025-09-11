'use client'

import { categorySchema } from '../data/schema'
import { EditCategoryDrawer } from './edit-category-form'
import type { Row } from '@tanstack/react-table'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const category = categorySchema.parse(row.original)

  return <EditCategoryDrawer category={category} />
}
