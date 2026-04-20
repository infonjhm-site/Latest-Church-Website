"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Calendar, Megaphone, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";

import { Announcement } from "@/lib/api/db";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Renamed from isAddOpen
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null); // New state for editing
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleEditAnnouncement = (announcement: Partial<Announcement> | null) => {
    // If it's a new announcement (or null is passed), set default values
    if (!announcement || !('_id' in announcement) || !announcement._id) {
       setEditingAnnouncement({
         title: '',
         content: '',
         type: 'daily',
         startDate: new Date().toISOString().split('T')[0],
         endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 1 week
       } as Announcement);
    } else {
      // It's an existing announcement
      setEditingAnnouncement({
        ...announcement,
        // _id is a string, and we ensure it's properly handled via the Partial<Announcement> cast from the database format.
      } as Announcement);
    }
    setIsDialogOpen(true);
  };
  

  const handleSave = async () => {
    try {
      const isEditing = editingAnnouncement && '_id' in editingAnnouncement && editingAnnouncement._id;
      
      // Construct payload taking care of mapping editingAnnouncement state correctly
      const payload = {
         title: editingAnnouncement?.title,
         type: editingAnnouncement?.type,
         content: editingAnnouncement?.content,
         startDate: editingAnnouncement?.startDate,
         endDate: editingAnnouncement?.endDate
      };

      const url = isEditing 
        ? `/api/announcements` 
        : `/api/announcements`;
        
      const method = isEditing ? "PUT" : "POST";
      
      // If we implement PUT in the API we would change url and pass ID. Our mock API only has POST for now.
      const payloadWithId = isEditing ? { ...payload, id: (editingAnnouncement as any)._id } : payload;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadWithId),
      });

      if (!res.ok) throw new Error("Failed to save");
      toast.success(isEditing ? "Announcement updated" : "Announcement created");
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      toast.error("Failed to save announcement");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground mt-1">Manage daily news and website ticker announcements.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Add Announcement
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">Title</Label>
              <Input 
                id="title" 
                value={editingAnnouncement?.title || ""} 
                onChange={(e) => setEditingAnnouncement(prev => prev ? { ...prev, title: e.target.value } : null)} 
                placeholder="Announcement Title"
                className="border-input placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-foreground">Type</Label>
              <Select 
                value={editingAnnouncement?.type || "daily"} 
                onValueChange={(v) => setEditingAnnouncement(prev => prev ? { ...prev, type: v as 'daily' | 'important' | 'scrolling' } : null)}
              >
                <SelectTrigger id="type" className="border-input">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Announcement</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="scrolling">Scrolling Ticker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">Content</Label>
              <Textarea 
                id="content" 
                value={editingAnnouncement?.content || ""} 
                onChange={(e) => setEditingAnnouncement(prev => prev ? { ...prev, content: e.target.value } : null)} 
                placeholder="Announcement Details"
                className="border-input placeholder:text-muted-foreground/50 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-foreground">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  value={editingAnnouncement?.startDate || ""} 
                  onChange={(e) => setEditingAnnouncement(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                  className="border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-foreground">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  value={editingAnnouncement?.endDate || ""} 
                  onChange={(e) => setEditingAnnouncement(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                  className="border-input"
                />
              </div>
            </div>
          </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Announcement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading announcements...</TableCell>
              </TableRow>
            ) : announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No announcements found.</TableCell>
              </TableRow>
            ) : announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="font-medium">{announcement.title}</TableCell>
                <TableCell>
                            <Badge className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                              announcement.type === "daily" ? "bg-blue-100 text-blue-800" :
                              announcement.type === "important" ? "bg-red-100 text-red-800" :
                              "bg-purple-100 text-purple-800"
                            }`}>
                              {announcement.type === "daily" && <Calendar className="w-3 h-3 mr-1" />}
                              {announcement.type === "important" && <AlertCircle className="w-3 h-3 mr-1" />}
                              {announcement.type === "scrolling" && <Megaphone className="w-3 h-3 mr-1" />}
                              {announcement.type}
                            </Badge>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    announcement.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {announcement.status}
                  </span>
                </TableCell>
                <TableCell>{announcement.startDate}</TableCell>
                <TableCell>{announcement.endDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" render={<span />} />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
