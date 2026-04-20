"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Megaphone, Video, CalendarDays, Users, MessageSquare, Settings } from "lucide-react";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
    { name: "Sermons & Live", path: "/admin/sermons", icon: Video },
    { name: "Events", path: "/admin/events", icon: CalendarDays },
    { name: "Ministries", path: "/admin/ministries", icon: Users },
    { name: "Prayer & Messages", path: "/admin/messages", icon: MessageSquare },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex h-full flex-col py-6">
          <div className="mb-8 px-6">
            <h1 className="text-xl font-bold tracking-tight text-primary">NJHM Admin</h1>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {routes.map((route) => {
              const isActive = pathname === route.path || (route.path !== "/" && pathname.startsWith(route.path));
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <route.icon className="h-5 w-5" />
                  {route.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
