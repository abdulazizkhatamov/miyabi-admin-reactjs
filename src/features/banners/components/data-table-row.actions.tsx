import { bannerSchema } from '../schema/banner.schema'
import { DeleteBannerDialog } from './delete-banner-dialog'
import type { Row } from '@tanstack/react-table'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const banner = bannerSchema.parse(row.original)

  return <DeleteBannerDialog banner={banner} />
}
