import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, MessageSquare, HandHeart, Video, Megaphone } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { name: "Total Members", value: "1,245", icon: Users, description: "+12% from last month" },
    { name: "Upcoming Events", value: "4", icon: CalendarDays, description: "Next 7 days" },
    { name: "Unread Messages", value: "12", icon: MessageSquare, description: "Requires attention" },
    { name: "Pending Prayer Requests", value: "8", icon: HandHeart, description: "New this week" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">Welcome back! Here is what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New Prayer Request</p>
                  <p className="text-sm text-muted-foreground">Submitted by Jane Doe</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">2 hours ago</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Youth Event Registered</p>
                  <p className="text-sm text-muted-foreground">5 new registrations for 'Friday Night Live'</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">6 hours ago</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New Contact Message</p>
                  <p className="text-sm text-muted-foreground">About Sunday Service timings</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">Yesterday</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/sermons" className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <div className="bg-primary/10 p-2 rounded-full">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Update Sunday Livestream</p>
              </div>
            </Link>
            <Link href="/admin/announcements" className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <div className="bg-primary/10 p-2 rounded-full">
                <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Post New Announcement</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
