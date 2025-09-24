import * as React from 'react'
import {
  IconBrandProducthunt,
  IconCategory,
  IconDashboard,
  IconInnerShadowTop,
  IconPhotoScan,
  IconSettings,
} from '@tabler/icons-react'

import { NavMain } from '@/shared/components/nav-main'
import { NavSecondary } from '@/shared/components/nav-secondary'
import { NavUser } from '@/shared/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: IconDashboard,
    },
    {
      title: 'Categories',
      url: '/categories',
      icon: IconCategory,
    },
    {
      title: 'Products',
      url: '/products',
      icon: IconBrandProducthunt,
    },
    {
      title: 'Banners',
      url: '/banners',
      icon: IconPhotoScan,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
