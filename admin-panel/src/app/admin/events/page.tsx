"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";

import { Event } from "@/lib/api/db";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const [formData, setFormData] = useState({
    title: "", date: "", time: "", location: "", description: "", image: ""
  });

  const handleSave = async () => {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setIsAddOpen(false);
      setFormData({ title: "", date: "", time: "", location: "", description: "", image: "" }); // Reset form
      fetchEvents();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground mt-1">Manage upcoming church activities and special services.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                Add a new event to your church's calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Youth Summer Camp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date || ""} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={formData.time || ""} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Main Sanctuary" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Event details..." className="min-h-[100px]" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input id="image" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No events found.</div>
        ) : (
          events.map((event) => (
          <Card key={event.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {event.image ? (
              <div className="aspect-video w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video w-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-10 w-10 text-primary/30" />
              </div>
            )}
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1 pr-4">
                <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">{event.description}</CardDescription>
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
            <CardContent className="flex-1 pt-4 border-t mt-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
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
