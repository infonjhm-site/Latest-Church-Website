"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, Users, MapPin, Contact, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Ministry } from "@/lib/api/db";

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMinistries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ministries");
      const data = await res.json();
      setMinistries(data);
    } catch (error) {
      console.error("Failed to fetch ministries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const [formData, setFormData] = useState({
    name: "", description: "", meeting: "", contact: "", phone: ""
  });

  const handleSave = async () => {
    try {
      await fetch("/api/ministries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setIsAddOpen(false);
      fetchMinistries();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ministries</h2>
          <p className="text-muted-foreground mt-1">Manage Life Teams, volunteer groups, and church departments.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Add Ministry
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Ministry Group</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Ministry Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Youth Impact" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Briefly describe the ministry..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meeting">Meeting Time & Location</Label>
                <Input id="meeting" value={formData.meeting} onChange={e => setFormData({...formData, meeting: e.target.value})} placeholder="e.g. Fridays, 7:00 PM @ Youth Hall" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input id="contact" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="e.g. Pastor Mark" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. 555-0101" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Ministry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Loading ministries...</div>
        ) : ministries.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No ministries found.</div>
        ) : (
          ministries.map((ministry) => (
          <Card key={ministry.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1 pr-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {ministry.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px] pt-1">{ministry.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 shrink-0" />}>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
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
            </CardHeader>
            <CardContent className="flex-1 pt-4 border-t mt-4 bg-muted/20">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-snug">{ministry.meeting}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Contact className="h-4 w-4 text-primary shrink-0" />
                  <span>{ministry.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>{ministry.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
