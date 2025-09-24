import { Link } from '@tanstack/react-router'
import { DataTableColumnHeader } from '../../../shared/components/data-table-column-header'
import { DataTableRowActions } from './data-table-row.actions'
import type { ColumnDef } from '@tanstack/react-table'
import type { Banner } from '../schema/banner.schema'
import { Checkbox } from '@/shared/components/ui/checkbox'

export const columns: Array<ColumnDef<Banner>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Link to={'/banners/$id'} params={{ id: row.original.id }}>
            <span className="max-w-[500px] truncate font-medium hover:underline">
              {row.getValue('name')}
            </span>
          </Link>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
