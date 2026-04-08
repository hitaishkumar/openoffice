"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Building2,
  CalendarDays,
  DoorOpen,
  Layers,
  LayoutDashboard,
  Lock,
  MonitorSpeaker,
  Phone,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const bookingItems = [
  { title: "Floor map", url: "/floor", icon: LayoutDashboard },
  { title: "My bookings", url: "/bookings", icon: CalendarDays },
  { title: "Quick book", url: "/quick", icon: Plus },
];

const manageItems = [
  { title: "Workstations", url: "/manage/workstations", icon: MonitorSpeaker },
  { title: "Meeting rooms", url: "/manage/meeting-rooms", icon: DoorOpen },
  { title: "Lockers", url: "/manage/lockers", icon: Lock },
  { title: "Phone booths", url: "/manage/booths", icon: Phone },
  { title: "Teams", url: "/manage/teams", icon: Users },
  { title: "Cubicles", url: "/manage/cubicles", icon: Layers },
];

const adminItems = [
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="group relative">
      {/* Floating trigger shown on hover */}
      <SidebarHeader className="invisible absolute top-3 right-2 z-50 translate-x-1/2 scale-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:scale-100">
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="bg-background">
        {/* Logo / brand */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Link href="/" className="flex items-center gap-2.5 px-2 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              {/* Label hidden when collapsed */}
              <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold leading-tight text-foreground">
                  K Fintech
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  Bhubaneshwar · 5th Floor
                </span>
              </div>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Booking */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Booking
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bookingItems.map((item) => (
                <SidebarMenuItem key={item.title} className="pb-2">
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    variant="outline"
                  >
                    <Link href={item.url}>
                      <item.icon size={15} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Manage */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.title} className="pb-1">
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon size={15} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
            Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title} className="pb-2">
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon size={15} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
