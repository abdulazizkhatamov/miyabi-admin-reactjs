import { Link } from '@tanstack/react-router'
import { DataTableColumnHeader } from '../../../shared/components/data-table-column-header'
import type { ColumnDef } from '@tanstack/react-table'
import type { Category } from '../schema/category.schema'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { StatusBadge } from '@/shared/components/status-badge'

export const columns: Array<ColumnDef<Category>> = [
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
          <Link to={'/categories/$id'} params={{ id: row.original.id }}>
            <span className="max-w-[500px] truncate font-medium hover:underline">
              {row.getValue('name')}
            </span>
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusBadge value={row.getValue('status')} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
