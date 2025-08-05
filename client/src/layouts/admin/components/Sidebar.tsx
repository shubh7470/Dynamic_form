"use client";

import * as React from "react";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboard,
  List,
  LogOut,
  Network,
  ReceiptIndianRupee,
  Settings2,
  Sparkles,
  SquareTerminal,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Link } from "react-router-dom";

// This is sample data.

import DynamicForm from "./dynamic/dynamic_form";

const data = {
  user: {
    name: "Admin",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/admin/",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Student Managment",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Add Students",
          url: "/admin/students/add",
        },
        {
          title: "Registered Students",
          url: "/admin/students/registered",
        },
        {
          title: "Unregistered Students",
          url: "/admin/students/unregistered",
        },
        {
          title: "Pass Out Students",
          url: "#",
        },
        {
          title: "Serch Students",
          url: "#",
        },
      ],
    },
    {
      title: "Exams & Results",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Branch Managment",
      url: "#",
      icon: Network,
      items: [
        {
          title: "Add Branch",
          url: "/admin/branches/add",
        },
        {
          title: "Branch List",
          url: "/admin/branches",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Invoice Managment",
      url: "#",
      icon: ReceiptIndianRupee,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Course Managment",
      url: "#",
      icon: List,
      items: [
        {
          title: "Course Categories",
          url: "/admin/course/categories",
        },
        {
          title: "Course List",
          url: "/admin/courses",
        },
        {
          title: "Course Papers",
          url: "/admin/course/papers",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: Bot,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

type PageProps = {
  children: React.ReactNode;
};

export default function Page({ children }: PageProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedSection, setSelectedSection] = React.useState<string>("");

  // Render DynamicForm for add actions
  let formToShow: string | null = null;
  if (selectedSection === "Add Students") formToShow = "student";
  if (selectedSection === "Add Branch") formToShow = "branch";
  if (selectedSection === "Add Course") formToShow = "course";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => setSelectedSection(item.title)}
                      >
                        {item.icon && <item.icon />}

                        {item.items && item.items.length > 0 ? (
                          <>
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </>
                        ) : (
                          <Link to={item.url} className="w-full">
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && item.items.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  to={subItem.url}
                                  className="w-full"
                                  onClick={() => setSelectedSection(subItem.title)}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {user?.email || data.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.avatar || data.user.avatar}
                          alt={data.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name || data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {user?.email || data.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-[1px] border-gray-200 bg-gray-100/35 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 ">
            <SidebarTrigger className="-ml-1" />
            <div className="w-[1px] h-5 bg-gray-200 "></div>
          </div>
        </header>
        <main>
          {formToShow ? <DynamicForm formType={formToShow} /> : children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
